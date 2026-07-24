import { Client } from "../models/Client.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateClientPayload } from "../validators/client.validator.js";

/**
 * POST /api/clients
 */
/**
 * POST /api/clients
 */
export const createClient = asyncHandler(async (req, res) => {
  const { name, email, phone, address, notes } = req.body;
  validateClientPayload(req.body);

  const existing = await Client.findOne({ email: email.toLowerCase() });

  if (existing) {
    if (existing.isActive) {
      throw new ApiError(409, "A client with this email already exists");
    }

    // An inactive (soft-deleted) client is holding this email — reactivate
    // and refresh their record instead of creating a duplicate or blocking
    // a legitimate re-add.
    existing.isActive = true;
    existing.name = name.trim();
    existing.phone = phone.trim();
    existing.address = address?.trim() || "";
    existing.notes = notes?.trim() || "";
    await existing.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          existing,
          "An inactive client with this email existed — it has been reactivated and updated"
        )
      );
  }

  const client = await Client.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    address: address?.trim() || "",
    notes: notes?.trim() || "",
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, client, "Client created successfully"));
});

/**
 * GET /api/clients?search=&page=&limit=&status=active|inactive|all
 */
export const getClients = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10, status = "active" } = req.query;

  const filter = {};
  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;
  // status === "all" -> no filter on isActive

  if (search.trim()) {
    filter.$text = { $search: search.trim() };
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
  const skip = (pageNum - 1) * limitNum;

  const [clients, total] = await Promise.all([
    Client.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    Client.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      clients,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    }),
  );
});

/**
 * GET /api/clients/:id
 */
export const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    throw new ApiError(404, "Client not found");
  }
  return res.status(200).json(new ApiResponse(200, client));
});

/**
 * PATCH /api/clients/:id
 */
export const updateClient = asyncHandler(async (req, res) => {
  const { name, email, phone, address, notes } = req.body;
  validateClientPayload(req.body, { partial: true });

  const client = await Client.findById(req.params.id);
  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  if (email && email.toLowerCase() !== client.email) {
    const emailTaken = await Client.findOne({ email: email.toLowerCase() });
    if (emailTaken) {
      throw new ApiError(409, "Another client already uses this email");
    }
    client.email = email.toLowerCase().trim();
  }

  if (name !== undefined) client.name = name.trim();
  if (phone !== undefined) client.phone = phone.trim();
  if (address !== undefined) client.address = address.trim();
  if (notes !== undefined) client.notes = notes.trim();

  await client.save();

  return res
    .status(200)
    .json(new ApiResponse(200, client, "Client updated successfully"));
});

/**
 * DELETE /api/clients/:id
 * Soft delete — flips isActive to false instead of removing the document,
 * since Projects/Payments/Documents will reference this client later.
 */
export const deactivateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  client.isActive = false;
  await client.save();

  return res
    .status(200)
    .json(new ApiResponse(200, client, "Client deactivated"));
});

/**
 * PATCH /api/clients/:id/reactivate
 */
export const reactivateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  client.isActive = true;
  await client.save();

  return res
    .status(200)
    .json(new ApiResponse(200, client, "Client reactivated"));
});
