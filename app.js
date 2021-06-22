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

      annual_expense_rental_commission_percent: 0,
      annual_expense_cad_fee_percent: "included",
      annual_expense_cad_fee_annualized: 0,
      annual_expense_cleaning_fee_per_rented_week: 0,
      annual_expense_cardBooking_service_fee_percent: "included",
      annual_expense_booking_site_service_fee_annualized: 0,
      annual_expense_other_management_fee_per_month: "included",
      annual_expense_other_management_fee_annualized: 0,
      annual_expense_nightly_insurance_fee_per_night: "included",
      annual_expense_insurance_fee_annualized: 0,
      annual_expense_taxes: "included",
      annual_expense_taxes_annualized: 0,
      annual_expense_other_variable_expenses_annualized: 0,

      annual_fixed_expense_permit: "included",
      annual_fixed_expense_tech_costs: "included",
      annual_fixed_expense_yard_pest_control: "included",
      annual_fixed_expense_pool_maintenance: "included",
      annual_fixed_expense_electricity: "included",
      annual_fixed_expense_water: "included",
      annual_fixed_expense_internet: "included",
      annual_fixed_expense_accounting: "tbd",
      annual_fixed_expense_taxes: 0,
      annual_fixed_expense_homeowners_insurance: "included",
      annual_fixed_expense_short_term_insurance_riders: "included",
      annual_fixed_expense_liability_insurance: 0,
      annual_fixed_expense_HOA_dues: 0,
      annual_fixed_expense_membership_fees: 0,
      annual_fixed_expense_reservers: 0,
      annual_fixed_expense_other_annualized: 0,
      annual_fixed_expense_bed_bug_program: 0,
      annual_fixed_expense_insurance_rider_policy: 0,
      annual_fixed_expense_monthly_maintenance_program: 0,
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

    annual_expense_rental_commission() {
      var value = Math.round(
        (parseFloat(this.annual_expense_rental_commission_percent) *
          this.projected_income_gross_rent) /
          100
      );
      return value;
    },

    annual_expense_cleaning_fee_annualized() {
      return (
        parseFloat(this.annual_expense_cleaning_fee_per_rented_week) *
        this.projected_income_weeks_rented
      );
    },

    annual_expense_annualized_variable_expense() {
      var value =
        this.annual_expense_rental_commission +
        parseFloat(this.annual_expense_cad_fee_annualized) +
        parseFloat(this.annual_expense_cleaning_fee_annualized) +
        parseFloat(this.annual_expense_booking_site_service_fee_annualized) +
        parseFloat(this.annual_expense_other_management_fee_annualized) +
        parseFloat(this.annual_expense_insurance_fee_annualized) +
        parseFloat(this.annual_expense_taxes_annualized);

      return value;
    },

    annual_expense_total_expense() {
      return (
        this.annual_expense_annualized_variable_expense +
        this.annual_fixed_expense
      );
    },

    annual_fixed_expense() {
      var value =
        parseFloat(this.annual_fixed_expense_taxes) +
        parseFloat(this.annual_fixed_expense_liability_insurance) +
        parseFloat(this.annual_fixed_expense_HOA_dues) +
        parseFloat(this.annual_fixed_expense_membership_fees) +
        parseFloat(this.annual_fixed_expense_reservers) +
        parseFloat(this.annual_fixed_expense_other_annualized) +
        parseFloat(this.annual_fixed_expense_bed_bug_program) +
        parseFloat(this.annual_fixed_expense_insurance_rider_policy) +
        parseFloat(this.annual_fixed_expense_monthly_maintenance_program);

      return value;
    },

    projected_return_monthly_cash_flow() {
      var value = Math.abs(
        (parseFloat(this.projected_return_annual_cash_flow) / 12).toFixed(2)
      );
      return value;
    },
    projected_return_annual_cash_flow() {
      var value = Math.abs(
        (
          this.projected_income_gross_rent -
          this.annual_expense_total_expense -
          this.loan_annual_mortgage
        ).toFixed(2)
      );

      return value;
    },
    projected_return_cash_on_cash() {
      var value = (
        (this.projected_return_annual_cash_flow /
          (this.loan_capital_investment +
            parseFloat(this.acquisition_closing_costs) +
            parseFloat(this.acquisition_home_inspection) +
            parseFloat(this.acquisition_furniture_packages) +
            parseFloat(this.acquisition_rehab_estimates))) *
        100
      ).toFixed(2);
      return value;
    },
    projected_return_break_even() {
      var B37 = this.projected_return_debt_service;
      var J26 = this.annual_fixed_expense;
      var B20 = this.projected_income_annualRent;
      var G7 = parseFloat(this.annual_expense_rental_commission_percent);
      var G11 = parseFloat(this.annual_expense_cleaning_fee_per_rented_week);
      var f = B37 + J26;
      var s = B20;
      var t = G7 * B20;
      var fo = G11 * 52;

      var value = (f / (s - t - fo)).toFixed(2);

      return value;
    },
    projected_return_break_even_occupancy_weeks() {
      var value = this.projected_return_break_even * 52;
      return value;
    },
    projected_return_debt_service() {
      var value = this.projected_return_annual_cash_flow;
      return value;
    },
    projected_return_STR_approach() {
      var value =
        this.projected_return_debt_service /
        parseFloat(this.acquisition_purchase_price);
      return value;
    },
    projected_return_excl_debt_service() {
      var value =
        this.loan_annual_mortgage + this.projected_return_annual_cash_flow;
      return value;
    },
    projected_return_traditional_approach() {
      var value =
        this.projected_return_excl_debt_service /
        parseFloat(this.acquisition_purchase_price);
      return this.percentage(value);
    },
  },
  methods: {
    percentage(num) {
      var value = (num / 100).toFixed(2);
    },
  },
});

app.mount("#app");
