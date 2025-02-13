import { checkMultiLanguageMaxLength, checkMultiLanguageRequired } from '@lib/validation'

const rules = {
  name: [{ required: true }],
  names: [
    { required: true, validator: (rule, value) => checkMultiLanguageRequired(rule, value, 'RATING_BADGE_NAME') },
    { max: 64, validator: (rule, value) => checkMultiLanguageMaxLength(rule, value, 'RATING_BADGE_NAME') }
  ],
  code: [{ required: true }, { max: 64 }],
  description: [{ required: true }, { max: 5000 }],
  sortNumber: [{ required: true }, { type: 'number' as const, max: 32768 }]
}

export default rules
