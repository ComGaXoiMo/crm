const rules = {
  required: [{ required: true }],
  project: [
    {
      required: true,
    },
    {
      max: 3,
      type: "array",
      message: "You can select up to three items",
    },
  ],
  unit: [
    {
      required: true,
      message: "Please select at least one item",
    },
    {
      max: 3,
      type: "array",
      message: "You can select up to three items",
    },
  ],
}

export default rules
