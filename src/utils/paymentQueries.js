import { supabase } from "../lib/supabaseClient";

export function deriveInitialPaymentStatus({ paymentMethod, hasProofOrReference }) {
  if (paymentMethod === "cod") return "unpaid";
  return hasProofOrReference ? "pending_verification" : "unpaid";
}

export async function createPaymentForOrder({
  orderId,
  userId,
  paymentMethod,
  amount = null,
  referenceNumber = "",
  proofPath = "",
  notes = "",
}) {
  const initialStatus = deriveInitialPaymentStatus({
    paymentMethod,
    hasProofOrReference: Boolean(referenceNumber || proofPath),
  });

  const { data, error } = await supabase
    .from("payments")
    .insert({
      order_id: orderId,
      user_id: userId,
      payment_method: paymentMethod,
      payment_status: initialStatus,
      amount,
      reference_number: referenceNumber || null,
      proof_path: proofPath || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchPaymentByOrderId(orderId) {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      id,
      order_id,
      user_id,
      payment_method,
      payment_status,
      amount,
      reference_number,
      proof_path,
      notes,
      review_note,
      reviewed_by,
      reviewed_at,
      created_at,
      updated_at,
      payment_status_history (
        id,
        payment_id,
        previous_status,
        new_status,
        note,
        changed_by,
        actor_role,
        changed_at
      )
    `)
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    payment_status_history: [...(data?.payment_status_history ?? [])].sort(
      (a, b) => new Date(a.changed_at) - new Date(b.changed_at)
    ),
  };
}

export async function uploadPaymentProof({ userId, orderId, file }) {
  if (!userId || !orderId || !file) {
    throw new Error("Missing upload arguments.");
  }

  const safeName = file.name.replace(/\s+/g, "-");
  const path = `${userId}/${orderId}/${Date.now()}-${safeName}`;

  const { error } = await supabase
    .storage
    .from("payment-proofs")
    .upload(path, file, {
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) throw error;
  return path;
}

export async function getPaymentProofSignedUrl(proofPath, expiresIn = 3600) {
  if (!proofPath) return "";

  const { data, error } = await supabase
    .storage
    .from("payment-proofs")
    .createSignedUrl(proofPath, expiresIn);

  if (error) throw error;
  return data?.signedUrl ?? "";
}

export async function reviewPayment({ paymentId, newStatus, reviewNote = "" }) {
  if (!paymentId) throw new Error("Missing payment id.");

  const { data, error } = await supabase.functions.invoke("payment-admin-control", {
    body: {
      action: "review_payment",
      paymentId,
      newStatus,
      reviewNote,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);

  return data?.data;
}