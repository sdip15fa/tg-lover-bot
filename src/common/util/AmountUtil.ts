import formatCurrency from "format-currency";

const format = (amount: number) => {
    return formatCurrency(amount).replace(/\.00$/, "");
};

export const AmountUtil = Object.freeze({
    format,
});
