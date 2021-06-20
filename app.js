const app = Vue.createApp({
  data() {
    return {
      acquisition_purchase_price: 0,
      acquisition_closing_costs: 0,
      acquisition_home_inspection: 0,
      acquisition_furniture_packages: 0,
      acquisition_rehab_estimates: 0,
      acquisition_other_costs: 0,
    };
  },
  computed: {
    acquisition_total_investment() {
      var sum =
        parseFloat(
          this.acquisition_purchase_price ? this.acquisition_purchase_price : 0
        ) +
        parseFloat(
          this.acquisition_closing_costs ? this.acquisition_closing_costs : 0
        ) +
        parseFloat(
          this.acquisition_home_inspection
            ? this.acquisition_home_inspection
            : 0
        ) +
        parseFloat(
          this.acquisition_furniture_packages
            ? this.acquisition_furniture_packages
            : 0
        ) +
        parseFloat(
          this.acquisition_rehab_estimates
            ? this.acquisition_rehab_estimates
            : 0
        ) +
        parseFloat(
          this.acquisition_other_costs ? this.acquisition_other_costs : 0
        );

      return sum;
    },
  },
});

app.mount("#app");
