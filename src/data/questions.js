export const questions = [
  {
    key: "form_factor", 
    question: "How big is the celebration, and what size feels right?",
    options: [
      { label: "For few people (Bento box or Cupcakes)", vectorValue: 1 },
      { label: "A standard party (Classic round or square cake)", vectorValue: 5 },
      { label: "A huge celebration (Multi-tier or Custom sculpted shape)", vectorValue: 9 }
    ]
  },
  {
    key: "aesthetic", 
    question: "What is the overall vibe of the event?",
    options: [
      { label: "Elegant & Formal (Weddings, Anniversaries)", vectorValue: 1 },
      { label: "Casual & Fun (Standard Birthdays, Get-togethers)", vectorValue: 5 },
      { label: "Playful & Loud (Kids' Themes, Pop Culture, Characters)", vectorValue: 9 }
    ]
  },
  {
    key: "complexity", 
    question: "How detailed do you want the decorations to be?",
    options: [
      { label: "Keep it simple and clean (Smooth finish, minimal text)", vectorValue: 1 },
      { label: "A bit dressy (Frosting swirls, drips, or candy toppings)", vectorValue: 5 },
      { label: "Go all out! (Complex 3D shapes, fondant figures, elaborate scenes)", vectorValue: 9 }
    ]
  },
  {
    key: "flavor", 
    question: "What type of flavors do you usually enjoy?",
    options: [
      { label: "Classic Crowd-Pleasers (Vanilla, Chocolate, Chiffon)", vectorValue: 1 },
      { label: "Something a little different (Strawberry, Mocha, Coffee)", vectorValue: 5 },
      { label: "Rich & Premium (Yema, Red Velvet, Carrot)", vectorValue: 9 }
    ]
  },
  {
    key: "primary_color", 
    question: "Do you have a main color in mind?",
    options: [
      { label: "Pinks / Reds", textValue: "Pink" },
      { label: "Blues / Greens", textValue: "Blue" },
      { label: "Chocolates / Neutrals", textValue: "Chocolate" },
      { label: "Whites / Creams", textValue: "White" },
      { label: "No Preference / Surprise Me", textValue: "Any" }
    ]
  }
];