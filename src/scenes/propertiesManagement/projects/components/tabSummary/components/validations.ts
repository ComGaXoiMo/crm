
const rules = {
  required: [{ required: true }],
  projectName: [{ required: true }, { max: 200 }],
  projectCode: [{ required: true }, { max: 50 }],
  budget: [ { max: 200 }],
  projectManager: [ { max: 200 }],
  description: [{ required: true }, { max: 2000 }],
  sortNumber: [
    { required: false },
    {
      pattern: /^[\d]{0,2}$/,
      message: "Max value is 99",
    },
  ],
  inputNumber: [
    { required: false },
    
    {
      pattern: /^\d{1,12}(?:\.\d{1,6})?$/,
      message: "Max field length is [12] point [6]",
    },
  ],
  address: [
    {
      required: true,

    },
  ],
}

export default rules
