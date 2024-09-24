module.exports = {
  apps : [
    {
      name: "nuxt-build",
      script: "npm",
      args: "run build"
    },
    {
      name: "nuxt-serve",
      script: "npm",
      args: "run serve"
    }
  ]
}