'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function LiveMeetingForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule New Live Meeting</CardTitle>
        <CardDescription>
          Fill in the details to create a new live meeting event.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="meeting-title">Meeting Title</Label>
          <Input id="meeting-title" placeholder="e.g., Weekly Bible Study" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="meeting-description">Description</Label>
          <Textarea
            id="meeting-description"
            placeholder="A brief description of the meeting."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input id="start-time" type="datetime-local" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input id="end-time" type="datetime-local" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="meeting-url">Meeting URL</Label>
          <Input
            id="meeting-url"
            placeholder="e.g., https://meet.google.com/abc-xyz"
          />
        </div>
        <Button className="w-full md:w-auto">Create Meeting</Button>
      </CardContent>
    </Card>
  );
}
