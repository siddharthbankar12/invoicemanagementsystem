import Invoice from "../models/invoice.schema.js";

export const CreateInvoice = async (req, res) => {
  try {
    const { invoiceNumber, date, amount, financialYear, createdBy } = req.body;

    if (!invoiceNumber || !date || !amount || !financialYear) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const parsedDate = new Date(date);

    const existingInvoice = await Invoice.findOne({
      invoiceNumber,
      financialYear,
    });

    if (existingInvoice) {
      return res.status(409).json({
        success: false,
        message: `Invoice number ${invoiceNumber} already exists in financial year ${financialYear}.`,
      });
    }

    const prevInvoice = await Invoice.findOne({
      financialYear,
      invoiceNumber: { $lt: invoiceNumber },
    }).sort({ invoiceNumber: -1 });

    const nextInvoice = await Invoice.findOne({
      financialYear,
      invoiceNumber: { $gt: invoiceNumber },
    }).sort({ invoiceNumber: 1 });

    if (prevInvoice && parsedDate <= new Date(prevInvoice.date)) {
      return res.status(400).json({
        success: false,
        message: `Invoice date must be after invoice number ${prevInvoice.invoiceNumber}'s date.`,
      });
    }

    if (nextInvoice && parsedDate >= new Date(nextInvoice.date)) {
      return res.status(400).json({
        success: false,
        message: `Invoice date must be before invoice number ${nextInvoice.invoiceNumber}'s date.`,
      });
    }

    const newInvoice = new Invoice({
      invoiceNumber,
      date: parsedDate,
      amount,
      financialYear,
      createdBy,
    });

    await newInvoice.save();

    return res
      .status(201)
      .json({ success: true, message: "Invoice created successfully." });
  } catch (error) {
    console.error("CreateInvoice Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const UpdateInvoice = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const { date, amount } = req.body;

    const invoice = await Invoice.findOne({ invoiceNumber });
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found." });
    }

    const parsedDate = new Date(date);
    const financialYear = invoice.financialYear;

    const prevInvoice = await Invoice.findOne({
      financialYear,
      invoiceNumber: { $lt: invoiceNumber },
    }).sort({ invoiceNumber: -1 });

    const nextInvoice = await Invoice.findOne({
      financialYear,
      invoiceNumber: { $gt: invoiceNumber },
    }).sort({ invoiceNumber: 1 });

    if (prevInvoice && parsedDate <= new Date(prevInvoice.date)) {
      return res.status(400).json({
        success: false,
        message: `Invoice date must be after invoice number ${prevInvoice.invoiceNumber}'s date.`,
      });
    }

    if (nextInvoice && parsedDate >= new Date(nextInvoice.date)) {
      return res.status(400).json({
        success: false,
        message: `Invoice date must be before invoice number ${nextInvoice.invoiceNumber}'s date.`,
      });
    }

    invoice.date = parsedDate;
    invoice.amount = amount;

    await invoice.save();

    return res
      .status(200)
      .json({ success: true, message: "Invoice updated successfully." });
  } catch (error) {
    console.error("UpdateInvoice Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const DeleteInvoices = async (req, res) => {
  try {
    const { invoiceNumber } = req.body;

    if (!invoiceNumber) {
      return res
        .status(400)
        .json({ success: false, message: "No invoice numbers provided." });
    }

    await Invoice.findOneAndDelete({
      invoiceNumber,
    });

    return res.status(200).json({
      success: true,
      message: "invoice deleted successfully.",
    });
  } catch (error) {
    console.error("DeleteInvoices Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const ListInvoices = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      financialYear,
      search,
      startDate,
      endDate,
      sortField = "invoiceNumber",
      sortOrder = "asc",
    } = req.query;

    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.max(1, parseInt(limit));
    const filter = {};

    if (financialYear) filter.financialYear = financialYear;
    if (search) filter.invoiceNumber = { $regex: search, $options: "i" };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({
          success: false,
          message: "Invalid startDate or endDate format.",
        });
      }

      filter.date = { $gte: start, $lte: end };
    }

    const sort = { [sortField]: sortOrder === "desc" ? -1 : 1 };

    const invoices = await Invoice.find(filter)
      .sort(sort)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .lean();

    const total = await Invoice.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: invoices,
      pagination: {
        total,
        page: parsedPage,
        pages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    console.error("ListInvoices Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
