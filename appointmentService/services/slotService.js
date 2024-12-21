class SlotService {
    generateTimeSlots() {
      const slots = [];
      let currentTime = new Date();
      currentTime.setHours(10, 0, 0); // Start at 10 AM
  
      while (currentTime.getHours() < 17) { // Until 5 PM
        const hour = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        
        // Skip lunch break (1 PM to 2 PM)
        if (hour !== 13) {
          slots.push(
            `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
          );
        }
        
        // Add 30 minutes
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
      return slots;
    }
  
    async getAvailableSlots(date, Appointment) {
      const allSlots = this.generateTimeSlots();
      
      // Get booked slots for the date
      const bookedSlots = await Appointment.find({
        date: {
          $gte: new Date(date).setHours(0,0,0),
          $lt: new Date(date).setHours(23,59,59)
        }
      }).select('timeSlot -_id');
  
      const bookedSlotTimes = bookedSlots.map(slot => slot.timeSlot);
      
      // Filter out booked slots
      return allSlots.filter(slot => !bookedSlotTimes.includes(slot));
    }
  }
  
  module.exports = new SlotService();
  