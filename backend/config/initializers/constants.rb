ERROR_LIST = {
  "ActiveRecord::RecordNotFound" => {
    code: "10404",
    message: "Record not found",
    transform: false
  },
  "ActiveRecord::RecordInvalid"  => {
    code: "10422",
    message: "Validation errors",
    transform: true
  },
  "AuthenticationFailed"  => {
    code: "10900",
    message: "Authentication failed",
    transform: false
  },
  "Unauthorized" => {
    code: "10999",
    message: "Unauthorized",
    transform: false
  },
  "Throttled" => {
    code: "10998",
    message: "Throttled",
    transform: false
  },
  "Default" => {
    code: "10500",
    message: "Internal server error",
    transform: false
  }
}.freeze
