import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  useGetAdminMe,
  useAdminLogin,
  useAdminLogout,
  useGetAppointmentStats,
  useListAppointments,
  useUpdateAppointment,
  useListServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useListReviews,
  useApproveReview,
  useDeleteReview,
  useListContactMessages,
  useListGallery,
  useCreateGalleryImage,
  useDeleteGalleryImage,
  getListAppointmentsQueryKey,
  getListServicesQueryKey,
  getListReviewsQueryKey,
  getListContactMessagesQueryKey,
  getListGalleryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function Admin() {
  const { data: adminMe, isLoading: isCheckingAuth } = useGetAdminMe();
  const loginMutation = useAdminLogin();
  const logoutMutation = useAdminLogout();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { data: { password } },
      {
        onSuccess: () => {
          toast({ title: "Logged in successfully" });
          queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
        },
        onError: () => {
          toast({ title: "Invalid password", variant: "destructive" });
        },
      },
    );
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "Logged out" });
        setPassword("");
        queryClient.clear();
        queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      },
    });
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!adminMe?.authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-border/50 bg-card">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-serif text-primary">
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-background"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center">
                <Button
                  variant="link"
                  type="button"
                  onClick={() => setLocation("/")}
                  className="text-sm text-muted-foreground"
                >
                  Return to Site
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your salon operations.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.open("/", "_blank")}
            >
              View Site
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-card border border-border h-auto p-1">
            <TabsTrigger
              value="appointments"
              className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Appointments
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Services
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentsTab />
          </TabsContent>
          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>
          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewsTab />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AppointmentsTab() {
  const { data: stats } = useGetAppointmentStats();
  const { data: appointments } = useListAppointments();
  const updateMutation = useUpdateAppointment();
  const queryClient = useQueryClient();

  const handleStatusChange = (id: number, status: string) => {
    updateMutation.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListAppointmentsQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: ["/api/appointments/stats"],
          });
        },
      },
    );
  };

  return (
    <div className="space-y-8">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Today
              </p>
              <p className="text-4xl font-bold text-primary mt-2">
                {stats.todayCount}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Pending
              </p>
              <p className="text-4xl font-bold text-orange-500 mt-2">
                {stats.pending}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Confirmed
              </p>
              <p className="text-4xl font-bold text-green-500 mt-2">
                {stats.confirmed}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total
              </p>
              <p className="text-4xl font-bold text-foreground mt-2">
                {stats.total}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Date & Time</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments?.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-border hover:bg-muted/20"
                  >
                    <td className="px-6 py-4 font-medium">
                      {format(new Date(app.appointmentDate), "MMM d, yyyy")}{" "}
                      <br />
                      <span className="text-muted-foreground">
                        {app.timeSlot}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {app.customerName} <br />
                      <span className="text-muted-foreground">
                        {app.customerPhone}
                      </span>
                    </td>
                    <td className="px-6 py-4">{app.serviceName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          app.status === "pending"
                            ? "bg-orange-100 text-orange-700"
                            : app.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : app.status === "completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {app.status !== "confirmed" &&
                          app.status !== "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() =>
                                handleStatusChange(app.id, "confirmed")
                              }
                            >
                              Confirm
                            </Button>
                          )}
                        {app.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() =>
                              handleStatusChange(app.id, "completed")
                            }
                          >
                            Complete
                          </Button>
                        )}
                        {app.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              handleStatusChange(app.id, "cancelled")
                            }
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ServicesTab() {
  const { data: services } = useListServices();
  const deleteMutation = useDeleteService();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Service deleted" });
            queryClient.invalidateQueries({
              queryKey: getListServicesQueryKey(),
            });
          },
        },
      );
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Manage Services</CardTitle>
        <ServiceDialog mode="create" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => (
            <Card key={service.id} className="border border-border/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{service.name}</h3>
                  <span className="font-bold text-primary">
                    Rs {service.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {service.category} • {service.durationMinutes}m
                  </span>
                  <div className="flex gap-2">
                    <ServiceDialog mode="edit" service={service} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceDialog({
  mode,
  service,
}: {
  mode: "create" | "edit";
  service?: any;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(
    service || {
      name: "",
      description: "",
      price: 0,
      durationMinutes: 60,
      category: "",
      imageUrl: "",
      isActive: true,
    },
  );

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: Number(formData.price),
      durationMinutes: Number(formData.durationMinutes),
    };

    if (mode === "create") {
      createMutation.mutate(
        { data },
        {
          onSuccess: () => {
            toast({ title: "Service created" });
            setOpen(false);
            queryClient.invalidateQueries({
              queryKey: getListServicesQueryKey(),
            });
          },
        },
      );
    } else {
      updateMutation.mutate(
        { id: service.id, data },
        {
          onSuccess: () => {
            toast({ title: "Service updated" });
            setOpen(false);
            queryClient.invalidateQueries({
              queryKey: getListServicesQueryKey(),
            });
          },
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>Add Service</Button>
        ) : (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Service" : "Edit Service"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Price (PKR)</Label>
              <Input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Duration (Mins)</Label>
              <Input
                type="number"
                required
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, durationMinutes: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Image URL (Optional)</Label>
            <Input
              value={formData.imageUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
          </div>
          <Button type="submit" className="w-full">
            Save Service
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GalleryTab() {
  const { data: gallery } = useListGallery();
  const createMutation = useCreateGalleryImage();
  const deleteMutation = useDeleteGalleryImage();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    imageUrl: "",
    caption: "",
    category: "",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({ title: "Image added" });
          setFormData({ imageUrl: "", caption: "", category: "" });
          queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
        },
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Image deleted" });
          queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
        },
      },
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 h-fit bg-card">
        <CardHeader>
          <CardTitle>Add Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL *</Label>
              <Input
                required
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Input
                value={formData.caption}
                onChange={(e) =>
                  setFormData({ ...formData, caption: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              Add to Gallery
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 bg-card">
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery?.map((img) => (
              <div
                key={img.id}
                className="relative group rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || "Gallery"}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(img.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewsTab() {
  const { data: allReviews } = useListReviews({ approved: "false" });
  const approveMutation = useApproveReview();
  const deleteMutation = useDeleteReview();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleApprove = (id: number) => {
    approveMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Review approved" });
          queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
        },
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Review deleted" });
          queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
        },
      },
    );
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Manage Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allReviews?.map((review) => (
            <div
              key={review.id}
              className={`p-4 rounded-xl border ${review.isApproved ? "border-border bg-background" : "border-primary/30 bg-primary/5"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">{review.customerName}</span>
                    <span className="text-yellow-500 font-bold">
                      ★ {review.rating}/5
                    </span>
                    {!review.isApproved && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded uppercase font-bold">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-foreground/80 italic">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex gap-2">
                  {!review.isApproved && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-200"
                      onClick={() => handleApprove(review.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {allReviews?.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No reviews found.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MessagesTab() {
  const { data: messages } = useListContactMessages();

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className="p-4 rounded-xl border border-border bg-background"
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-bold">{msg.name}</h4>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(msg.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                <span>{msg.email}</span>
                <span>{msg.phone}</span>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-sm text-foreground/90">
                {msg.message}
              </div>
            </div>
          ))}
          {messages?.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No messages found.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
