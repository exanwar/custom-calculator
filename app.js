const app = Vue.createApp({
  data() {
    return {
      acquisition_purchase_price: null,
      acquisition_closing_costs: null,
      acquisition_home_inspection: null,
      acquisition_furniture_packages: null,
      acquisition_rehab_estimates: null,
      acquisition_other_costs: null,

      projected_income_average_nightly: null,
      projected_income_occupancyRate: null,
      projected_income_additional_revenue: null,

      loan_down_payment_percent: null,
      loan_interest_rate: null,
      loan_amortization: null,

      annual_expense_rental_commission_percent: null,
      annual_expense_cad_fee_percent: "included",
      annual_expense_cad_fee_annualized: null,
      annual_expense_cleaning_fee_per_rented_week: null,
      annual_expense_cardBooking_service_fee_percent: "included",
      annual_expense_booking_site_service_fee_annualized: null,
      annual_expense_other_management_fee_per_month: "included",
      annual_expense_other_management_fee_annualized: null,
      annual_expense_nightly_insurance_fee_per_night: "included",
      annual_expense_insurance_fee_annualized: null,
      annual_expense_taxes: "included",
      annual_expense_taxes_annualized: null,
      annual_expense_other_variable_expenses_annualized: null,

      annual_fixed_expense_permit: "included",
      annual_fixed_expense_tech_costs: "included",
      annual_fixed_expense_yard_pest_control: "included",
      annual_fixed_expense_pool_maintenance: "included",
      annual_fixed_expense_electricity: "included",
      annual_fixed_expense_water: "included",
      annual_fixed_expense_internet: "included",
      annual_fixed_expense_accounting: "tbd",
      annual_fixed_expense_taxes: null,
      annual_fixed_expense_homeowners_insurance: "included",
      annual_fixed_expense_short_term_insurance_riders: "included",
      annual_fixed_expense_liability_insurance: null,
      annual_fixed_expense_HOA_dues: null,
      annual_fixed_expense_membership_fees: null,
      annual_fixed_expense_reservers: null,
      annual_fixed_expense_other_annualized: null,
      annual_fixed_expense_bed_bug_program: null,
      annual_fixed_expense_insurance_rider_policy: null,
      annual_fixed_expense_monthly_maintenance_program: null,
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
      return (
        parseFloat(
          this.projected_income_average_nightly
            ? this.projected_income_average_nightly
            : 0
        ) * 7
      );
    },

    projected_income_annualRent() {
      return this.projected_income_weeklyRent * 52;
    },

    projected_income_weeks_rented() {
      return (
        (parseFloat(
          this.projected_income_occupancyRate
            ? this.projected_income_occupancyRate
            : 0
        ) *
          52) /
        100
      );
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
      var purchase = parseFloat(
        this.acquisition_purchase_price ? this.acquisition_purchase_price : 0
      );
      var downPayment = parseFloat(
        this.loan_down_payment_percent ? this.loan_down_payment_percent : 0
      );

      return Math.round((purchase * downPayment) / 100);
    },

    loan_amount() {
      return (
        parseFloat(
          this.acquisition_purchase_price ? this.acquisition_purchase_price : 0
        ) - this.loan_capital_investment
      );
    },

    loan_monthly_payment() {
      /*
       * ir   - B34/12
       * np   - B35*12
       * pv   - B33
       * *
       */
      var ir =
        parseFloat(this.loan_interest_rate ? this.loan_interest_rate : 0) /
        100 /
        12;
      var np =
        parseFloat(this.loan_amortization ? this.loan_amortization : 0) * 12;
      var pv = this.loan_amount;

      var pmt, pvif;

      if (ir === 0) return -(pv / np).toFixed(2);

      pvif = Math.pow(1 + ir, np);
      pmt = Math.abs((-ir * (pv * pvif)) / (pvif - 1));

      return pmt.toFixed(2);
    },

    loan_annual_mortgage() {
      return (this.loan_monthly_payment * 12).toFixed(2);
    },

    annual_expense_rental_commission() {
      var value = Math.round(
        (parseFloat(
          this.annual_expense_rental_commission_percent
            ? this.annual_expense_rental_commission_percent
            : 0
        ) *
          this.projected_income_gross_rent) /
          100
      );
      return value;
    },

    annual_expense_cleaning_fee_annualized() {
      return (
        parseFloat(
          this.annual_expense_cleaning_fee_per_rented_week
            ? this.annual_expense_cleaning_fee_per_rented_week
            : 0
        ) * this.projected_income_weeks_rented
      );
    },

    annual_expense_annualized_variable_expense() {
      var value =
        this.annual_expense_rental_commission +
        parseFloat(
          this.annual_expense_cad_fee_annualized
            ? this.annual_expense_cad_fee_annualized
            : 0
        ) +
        this.annual_expense_cleaning_fee_annualized +
        parseFloat(
          this.annual_expense_booking_site_service_fee_annualized
            ? this.annual_expense_booking_site_service_fee_annualized
            : 0
        ) +
        parseFloat(
          this.annual_expense_other_management_fee_annualized
            ? this.annual_expense_other_management_fee_annualized
            : 0
        ) +
        parseFloat(
          this.annual_expense_insurance_fee_annualized
            ? this.annual_expense_insurance_fee_annualized
            : 0
        ) +
        parseFloat(
          this.annual_expense_taxes_annualized
            ? this.annual_expense_taxes_annualized
            : 0
        );

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
        parseFloat(
          this.annual_fixed_expense_taxes ? this.annual_fixed_expense_taxes : 0
        ) +
        parseFloat(
          this.annual_fixed_expense_liability_insurance
            ? this.annual_fixed_expense_liability_insurance
            : 0
        ) +
        parseFloat(
          this.annual_fixed_expense_HOA_dues
            ? this.annual_fixed_expense_HOA_dues
            : 0
        ) +
        parseFloat(
          this.annual_fixed_expense_membership_fees
            ? this.annual_fixed_expense_membership_fees
            : 0
        ) +
        parseFloat(
          this.annual_fixed_expense_reservers
            ? this.annual_fixed_expense_reservers
            : 0
        ) +
        parseFloat(
          this.annual_fixed_expense_other_annualized
            ? this.annual_fixed_expense_other_annualized
            : 0
        ) +
        parseFloat(
          this.annual_fixed_expense_bed_bug_program
            ? this.annual_fixed_expense_bed_bug_program
            : 0
        ) +
        parseFloat(
          this.annual_fixed_expense_insurance_rider_policy
            ? this.annual_fixed_expense_insurance_rider_policy
            : 0
        ) +
        parseFloat(
          this.annual_fixed_expense_monthly_maintenance_program
            ? this.annual_fixed_expense_monthly_maintenance_program
            : 0
        );

      return value;
    },

    projected_return_monthly_cash_flow() {
      var value = (
        parseFloat(this.projected_return_annual_cash_flow) / 12
      ).toFixed(2);
      return value;
    },
    projected_return_annual_cash_flow() {
      var value = (
        this.projected_income_gross_rent -
        this.annual_expense_total_expense -
        this.loan_annual_mortgage
      ).toFixed(2);
      return value;
    },
    projected_return_cash_on_cash() {
      var value = (-Math.abs(
        (this.projected_return_annual_cash_flow /
          (this.loan_capital_investment +
            parseFloat(
              this.acquisition_closing_costs
                ? this.acquisition_closing_costs
                : 0
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
            ))) *
          100
      )).toFixed(2);
      return value;
    },
    projected_return_break_even() {
      var B37 = parseFloat(this.loan_annual_mortgage);
      var J26 = this.annual_fixed_expense;
      var B20 = this.projected_income_annualRent;
      var G7 =
        parseFloat(
          this.annual_expense_rental_commission_percent
            ? this.annual_expense_rental_commission_percent
            : 0
        ) / 100;
      var G11 = parseFloat(
        this.annual_expense_cleaning_fee_per_rented_week
          ? this.annual_expense_cleaning_fee_per_rented_week
          : 0
      );
      var f = B37 + J26;
      var s = B20;
      var t = G7 * B20;
      var fo = G11 * 52;

      var value = f / (s - t - fo);

      return this.percentage(value);
    },
    projected_return_break_even_occupancy_weeks() {
      var value = (this.projected_return_break_even / 100) * 52;
      return value.toFixed(2);
    },
    projected_return_debt_service() {
      var value = this.projected_return_annual_cash_flow;
      return value;
    },
    projected_return_STR_approach() {
      var value = (-Math.abs(
        (this.projected_return_debt_service /
          parseFloat(
            this.acquisition_purchase_price
              ? this.acquisition_purchase_price
              : 0
          )) *
          100
      )).toFixed(2);
      return value;
    },
    projected_return_excl_debt_service() {
      var value =
        parseFloat(this.loan_annual_mortgage) +
        parseFloat(this.projected_return_annual_cash_flow);
      return value;
    },
    projected_return_traditional_approach() {
      var value =
        this.projected_return_excl_debt_service /
        parseFloat(
          this.acquisition_purchase_price ? this.acquisition_purchase_price : 0
        );
      return this.percentage(value);
    },
  },
  methods: {
    percentage(num) {
      var value = (num * 100).toFixed(2);
      return value;
    },
  },
});

app.mount("#app");
