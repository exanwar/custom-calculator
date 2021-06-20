const app = Vue.createApp({
  data() {
    return {
      acquisition_purchase_price: 0,
      acquisition_closing_costs: 0,
      acquisition_home_inspection: 0,
      acquisition_furniture_packages: 0,
      acquisition_rehab_estimates: 0,
      acquisition_other_costs: 0,

      projected_income_average_nightly: 0,
      projected_income_occupancyRate: 0,
      projected_income_additional_revenue: 0,

      loan_down_payment_percent: 0,
      loan_interest_rate: 0,
      loan_amortization: 0,
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

    projected_income_weeklyRent() {
      return parseFloat(this.projected_income_average_nightly) * 7;
    },

    projected_income_annualRent() {
      return this.projected_income_weeklyRent * 52;
    },

    projected_income_weeks_rented() {
      return (parseFloat(this.projected_income_occupancyRate) * 52) / 100;
    },

    projected_income_annual_gross_revenue() {
      return (
        (this.projected_income_weeks_rented / 52) *
        this.projected_income_annualRent
      );
    },

    projected_income_gross_rent() {
      return this.projected_income_annual_gross_revenue;
    },

    loan_capital_investment() {
      var purchase = parseFloat(this.acquisition_purchase_price);
      var downPayment = parseFloat(this.loan_down_payment_percent);

      return Math.round((purchase * downPayment) / 100);
    },

    loan_amount() {
      return (
        parseFloat(this.acquisition_purchase_price) -
        this.loan_capital_investment
      );
    },

    loan_monthly_payment() {
      /*
       * ir   - B34/12
       * np   - B35*12
       * pv   - B33
       * *
       */
      var ir = parseFloat(this.loan_interest_rate) / 100 / 12;
      var np = parseFloat(this.loan_amortization) * 12;
      var pv = this.loan_amount;

      var pmt, pvif;

      if (ir === 0) return -(pv / np).toFixed(2);

      pvif = Math.pow(1 + ir, np);
      pmt = Math.abs((-ir * (pv * pvif)) / (pvif - 1));

      return pmt.toFixed(2);
    },

    loan_annual_mortgage() {
      return this.loan_monthly_payment * 12;
    },
  },
});

app.mount("#app");
