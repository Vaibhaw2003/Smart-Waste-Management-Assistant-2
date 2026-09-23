# RPA workflow (UiPath or Power Automate)

**Trigger:** set `RPA_WEBHOOK_URL` in `backend/.env` to an HTTP trigger URL. The backend POSTs each new complaint:

```json
{ "complaintId": "SWM-1026", "category": "Overflowing Garbage Bin", "wasteType": "General Waste",
  "priority": "High", "location": "", "department": "Local Sanitation Team", "userId": "..." }
```

**Steps:** validate fields, look up the department for the category, notify the team (email/Teams/sheet), then update the complaint:

```
PUT http://localhost:5000/api/complaints/SWM-1026
Header: x-rpa-key: <RPA_API_KEY from .env>
Body:   { "status": "Assigned", "department": "Local Sanitation Team" }
```

Every update is appended to the complaint's `logs` array (the processing log).
Export flows into `complaint-processing/` and `complaint-routing/`.
