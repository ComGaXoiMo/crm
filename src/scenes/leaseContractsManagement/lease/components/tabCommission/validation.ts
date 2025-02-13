const rules = {
  
  percent: [    { required: true },
     {
    pattern: /^(?:100(?:\.00?)?|\d?\d(?:\.\d\d?)?)$/,
    message: "Max value is 100",
  },
]
}

export default rules
