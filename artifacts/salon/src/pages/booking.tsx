import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { useListServices, useGetAvailableSlots, useCreateAppointment, getListAppointmentsQueryKey, getGetAvailableSlotsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

export default function Booking() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialServiceId = searchParams.get("serviceId");

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(initialServiceId ? parseInt(initialServiceId) : null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services, isLoading: isLoadingServices } = useListServices();
  
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  
  const { data: slotsData, isLoading: isLoadingSlots } = useGetAvailableSlots(
    { date: formattedDate, serviceId: selectedServiceId || 0 },
    { query: { enabled: !!formattedDate && !!selectedServiceId, queryKey: getGetAvailableSlotsQueryKey({ date: formattedDate, serviceId: selectedServiceId || 0 }) } }
  );

  const createAppointment = useCreateAppointment();

  const handleNext = () => {
    if (step === 1 && !selectedServiceId) {
      toast({ title: "Please select a service", variant: "destructive" });
      return;
    }
    if (step === 2 && (!selectedDate || !selectedTimeSlot)) {
      toast({ title: "Please select a date and time", variant: "destructive" });
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId || !selectedDate || !selectedTimeSlot || !formData.customerName || !formData.customerPhone) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    createAppointment.mutate({
      data: {
        serviceId: selectedServiceId,
        appointmentDate: format(selectedDate, "yyyy-MM-dd"),
        timeSlot: selectedTimeSlot,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        notes: formData.notes || null,
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Appointment Confirmed!",
          description: "We look forward to seeing you.",
        });
        setStep(4); // Success step
        queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAvailableSlotsQueryKey({ date: formattedDate, serviceId: selectedServiceId }) });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Could not book the appointment. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  const selectedService = services?.find(s => s.id === selectedServiceId);

  return (
    <Layout>
      <div className="min-h-[80vh] bg-background py-12 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-foreground">Book Your Experience</h1>
            <p className="text-muted-foreground">Secure your moment of transformation with us.</p>
          </div>

          {/* Progress Bar */}
          {step < 4 && (
            <div className="mb-12">
              <div className="flex justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10 -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
                
                {[1, 2, 3].map((num) => (
                  <div 
                    key={num} 
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      step >= num ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-sm font-medium text-muted-foreground px-2">
                <span className={step >= 1 ? "text-primary" : ""}>Service</span>
                <span className={step >= 2 ? "text-primary" : ""}>Time</span>
                <span className={step >= 3 ? "text-primary" : ""}>Details</span>
              </div>
            </div>
          )}

          <Card className="bg-card shadow-lg border-border/50 overflow-hidden relative">
            <CardContent className="p-6 md:p-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-serif font-semibold mb-6">Select a Service</h2>
                    {isLoadingServices ? (
                      <div className="grid gap-4">
                        {[1,2,3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}
                      </div>
                    ) : (
                      <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2">
                        {services?.map((service) => (
                          <div 
                            key={service.id}
                            onClick={() => setSelectedServiceId(service.id)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedServiceId === service.id 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold text-lg text-foreground">{service.name}</h3>
                                <p className="text-sm text-muted-foreground">{service.durationMinutes} mins • {service.category}</p>
                              </div>
                              <div className="font-bold text-primary">
                                Rs {service.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end pt-6">
                      <Button onClick={handleNext} disabled={!selectedServiceId} className="rounded-full px-8">
                        Continue
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl mb-6">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Selected Service</p>
                        <p className="font-serif font-semibold text-lg">{selectedService?.name}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Change</Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setSelectedTimeSlot(null);
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            return date < today;
                          }}
                          className="rounded-xl border border-border shadow-sm p-3 bg-background"
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Select Time</h3>
                        {!selectedDate ? (
                          <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                            Please select a date first
                          </div>
                        ) : isLoadingSlots ? (
                          <div className="grid grid-cols-2 gap-3">
                            {[1,2,3,4].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}
                          </div>
                        ) : slotsData?.slots.length === 0 ? (
                          <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                            No slots available for this date
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                            {slotsData?.slots.map((slot) => (
                              <Button
                                key={slot.time}
                                variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                                disabled={!slot.available}
                                onClick={() => setSelectedTimeSlot(slot.time)}
                                className={`rounded-lg ${!slot.available ? "opacity-50" : ""}`}
                              >
                                {slot.time}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-6">
                      <Button variant="ghost" onClick={handleBack}>Back</Button>
                      <Button onClick={handleNext} disabled={!selectedDate || !selectedTimeSlot} className="rounded-full px-8">
                        Continue
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="bg-muted/30 p-5 rounded-xl mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Appointment Summary</p>
                        <p className="font-serif font-semibold text-lg">{selectedService?.name}</p>
                        <p className="text-muted-foreground">
                          {selectedDate && format(selectedDate, "EEEE, MMMM do, yyyy")} at {selectedTimeSlot}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">Rs {selectedService?.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <h3 className="text-xl font-semibold mb-4">Your Details</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input 
                            id="name" 
                            required
                            value={formData.customerName}
                            onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                            className="rounded-lg bg-background"
                            placeholder="Jane Doe"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input 
                            id="phone" 
                            required
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                            className="rounded-lg bg-background"
                            placeholder="+92 300 0000000"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="notes">Special Requests (Optional)</Label>
                          <Textarea 
                            id="notes" 
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            className="rounded-lg bg-background min-h-[100px]"
                            placeholder="Any allergies or specific requirements?"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-8">
                        <Button type="button" variant="ghost" onClick={handleBack} disabled={createAppointment.isPending}>Back</Button>
                        <Button type="submit" disabled={createAppointment.isPending} className="rounded-full px-10">
                          {createAppointment.isPending ? "Confirming..." : "Confirm Booking"}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-serif font-bold mb-4">Booking Confirmed!</h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Thank you, {formData.customerName}. Your appointment for <span className="font-semibold text-foreground">{selectedService?.name}</span> on <span className="font-semibold text-foreground">{selectedDate && format(selectedDate, "MMMM do")} at {selectedTimeSlot}</span> has been confirmed.
                    </p>
                    <Button onClick={() => window.location.href = "/"} className="rounded-full px-8">
                      Return to Home
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
