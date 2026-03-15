type EnvironmentName = "production" | "development" | "test"

const ENV = {
  [import.meta.env.MODE as EnvironmentName]: true,
  environmentName: import.meta.env.MODE as EnvironmentName
}

export default ENV