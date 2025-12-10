// Demo data for Campus Lost & Found
// These are sample items that appear on the Items page along with any
// user-submitted entries stored in localStorage.

const lostItemsDemo = [
  {
    itemName: "Realme TechLife Earbuds (Blue)",
    category: "Earbuds / Earphones",
    lastSeen: "LNCTS Old Campus – F11 Lab",
    dateLost: "2025-11-20",
    description: "Navy blue Realme TechLife TWS earbuds with charging case.",
    uniqueMarks: "Small scratch on the back side of the charging case.",
    contact: "student1@lncts.ac.in",
    photoUrl: "images/earbuds.png"
  },
  {
    itemName: "Milton Water Bottle (Blue)",
    category: "Water Bottle",
    lastSeen: "LNCTS New Campus – G2 Class",
    dateLost: "2025-11-21",
    description: "Steel Milton bottle, bright blue colour with white 'milton' logo.",
    uniqueMarks: "Owner's name written with black marker near the bottom.",
    contact: "student2@lncts.ac.in",
    photoUrl: "images/bottel.png"
  }
];

const foundItemsDemo = [
  {
    category: "ID Card",
    foundLocation: "Near CSE block",
    dateFound: "2025-11-19",
    keptAt: "With Finder",
    contact: "personal@example.com",
    notes: "Blue lanyard"
  },
  {
    category: "Bottle",
    foundLocation: "Ground floor canteen",
    dateFound: "2025-11-17",
    keptAt: "Department Office",
    contact: "dept@example.com",
    notes: "Green steel bottle"
  }
];

// Make available globally
window.lostItemsDemo = lostItemsDemo;
window.foundItemsDemo = foundItemsDemo;
