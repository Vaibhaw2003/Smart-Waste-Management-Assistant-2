import re
# (category, waste type, priority, department, keyword regex, guidance) - first match wins
RULES = [
 ("Illegal Dumping","Mixed Waste","High","Waste Enforcement Team",r"dump|thrown (on|in)|burning|burnt","Note the location and time, and avoid touching the waste. The enforcement team will investigate."),
 ("Overflowing Garbage Bin","General Waste","High","Local Sanitation Team",r"overflow|bin is full|spill|stink|smell","Keep clear of the bin. The sanitation team will clear it and inspect the bin."),
 ("Missed Waste Collection","General Waste","Medium","Waste Collection",r"not (been )?collected|missed|no one came|didn.?t come|truck","Keep waste in a closed bag near the gate until the collection crew arrives."),
 ("Hazardous Waste","Hazardous","High","Hazardous Waste Team",r"chemical|medical|syringe|needle|paint|pesticide|asbestos|acid","Never mix hazardous waste with household waste. Keep it sealed and away from children until it is collected."),
 ("E-Waste","Electronic / Hazardous","Medium","E-Waste Management Team",r"batter|e-?waste|electronic|phone|laptop|charger|\btv\b|bulb|cable","Do not put electronics or batteries in household waste. Take them to an authorised e-waste or battery collection point."),
 ("Plastic Waste","Plastic","Low","Recycling Unit",r"plastic|polythene|bottle|wrapper","Rinse and dry plastics, then place them in the dry-waste bin for recycling."),
 ("Organic Waste","Organic","Low","Composting Unit",r"food|kitchen|vegetable|compost|leaves|garden|peel","Put food and garden waste in the wet-waste bin, or compost it at home."),
 ("Recycling Issue","Recyclable","Low","Recycling Unit",r"recycl|paper|cardboard|glass|metal|\bcan\b","Keep recyclables clean, dry and separate from wet waste."),
]
DEFAULT = ("Other Waste Management Issues","General Waste","Low","General Support","","Please share more detail (waste type and location) so we can route this correctly.")

def analyze(message: str) -> dict:
    t = message.lower()
    category, waste, priority, dept, _, guidance = next((r for r in RULES if re.search(r[4], t)), DEFAULT)
    asks = bool(re.search(r"\b(how|where|what|which)\b.*\b(dispose|throw|recycle|discard|get rid|drop)\b|\bhow (do|can|to|should)\b", t))
    return {"intent": "guidance" if asks else "complaint", "category": category, "wasteType": waste,
            "priority": priority, "department": dept, "guidance": guidance, "status": "Pending"}
