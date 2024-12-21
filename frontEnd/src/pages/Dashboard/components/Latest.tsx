/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Chip, Grid, Skeleton, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { appointmentServiceClient } from "../../../util/api";

import { AppointmentType } from "../../../types/appoinmentType";

const initialPayload: AppointmentType = {
  name: "",
  phoneNumber: "",
  date: "",
  timeSlot: "",
};
const current = new Date();
export default function Latest() {
  const [slots, setSlots] = React.useState<string[]>([]);
  const [selectedSlot, setSelecetedSlot] = React.useState<string>("");
  const [selectedDate, setSelectedDate] = React.useState<string>(
    formatDate(current)
  );
  const [payload, setPayload] = React.useState(initialPayload);
  const [payloadErr, setPayloadErr] = React.useState(initialPayload);

  const handleClearSelectedPost = () => {
    setSelecetedSlot("");
    setPayload(initialPayload);
    setPayloadErr(initialPayload);
  };

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // When setting the date from an input
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
  };

  const handleLoadSlots = React.useCallback(async () => {
    try {
      const response = await appointmentServiceClient.get(
        `/slots/${selectedDate}`
      );
      if (response.status === 200) {
        setSlots(response.data.slots || []);
        return;
      }
      Swal.fire("Failed to load slots");
    } catch (error) {
      console.log("[!] ", error);
      Swal.fire({
        icon: "error",
        title: "Failed to load slots",
      });
    } finally {
      handleClearSelectedPost();
    }
  }, [selectedDate]);

  const handleSubmitBooking = React.useCallback(async () => {
    try {
      if (!payload.name)
        return setPayloadErr((pre) => ({ ...pre, name: "Name is required" }));
      if (!payload.phoneNumber)
        return setPayloadErr((pre) => ({
          ...pre,
          phoneNumber: "PhoneNumber is required",
        }));
      if (!selectedSlot)
        return setPayloadErr((pre) => ({
          ...pre,
          timeSlot: "TimeSlot is required",
        }));
      const response = await appointmentServiceClient.post(`/book`, {
        ...payload,
        timeSlot: selectedSlot,
        date: selectedDate,
      });
      if (response.status === 201) {
        Swal.fire({ icon: "success", title: "Slot booked successfully" });
        return;
      }
      Swal.fire("Failed to book slot, please try again");
    } catch (error: any) {
      console.log("[!] ", error);
      Swal.fire({
        icon: "error",
        title:
          error?.response?.data?.error ||
          "Failed to book slot please try again",
      });
    } finally {
      handleLoadSlots();
    }
  }, [payload, selectedDate, selectedSlot, handleLoadSlots]);

  React.useEffect(() => {
    handleLoadSlots();
  }, [handleLoadSlots]);

  return (
    <Grid container width="100%" gap={1}>
      <Typography variant="h2" gutterBottom>
        Book your slots
      </Typography>
      {
        <Grid container gap={1} width="100%">
          {slots.length < 1 ? (
            <Box display="flex" flexDirection="column" gap={1} width="100%">
              <Skeleton width="100%" />
              <Skeleton width="100%" />
              <Skeleton width="100%" />
            </Box>
          ) : (
            slots.map((item, index) => (
              <Chip
                label={item}
                key={`${index}_${item}`}
                onClick={() => setSelecetedSlot(item)}
                color={selectedSlot === item ? "success" : "default"}
              />
            ))
          )}
        </Grid>
      }
      <Grid container gap="1em">
        <TextField
          fullWidth
          placeholder="Name"
          size="small"
          value={payload.name}
          onChange={(e) => {
            setPayload((pre) => ({ ...pre, name: e.target.value }));
            setPayloadErr((pre) => ({ ...pre, name: "" }));
          }}
          error={payloadErr.name.length > 0}
          helperText={[payloadErr.name]}
          disabled={slots.length < 1}
        />
        <TextField
          fullWidth
          placeholder="Phone number"
          type="number"
          size="small"
          value={payload.phoneNumber}
          onChange={(e) => {
            setPayload((pre) => ({ ...pre, phoneNumber: e.target.value }));
            setPayloadErr((pre) => ({ ...pre, phoneNumber: "" }));
          }}
          error={payloadErr.phoneNumber.length > 0}
          helperText={[payloadErr.phoneNumber]}
          disabled={slots.length < 1}
        />
        <input type="date" value={selectedDate} onChange={handleDateChange} />
        <Grid item xs={12} display="flex" justifyContent="flex-end" gap="10px">
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleClearSelectedPost()}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSubmitBooking()}
            disabled={slots.length < 1}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
