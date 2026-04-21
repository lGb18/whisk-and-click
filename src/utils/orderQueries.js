import { supabase } from '../lib/supabaseClient';
import { withTimeout } from './fetchHelper';

export async function fetchMyOrders() {
  const { data, error } = await withTimeout(supabase
    .from('orders')
    .select(`
      id,
      created_at,
      reference_source,
      cake_reference_id,
      fallback_prompt,
      fallback_image_url,
      cake_config,
      customization,
      checkout_details,
      status,
      status_updated_at
    `)
    .order('created_at', { ascending: false })
  );
  if (error) throw error;
  return data ?? [];
}

export async function fetchOrderById(orderId) {
  const { data, error } = await withTimeout(supabase
    .from('orders')
    .select(`
      id,
      user_id,
      created_at,
      reference_source,
      cake_reference_id,
      fallback_prompt,
      fallback_image_url,
      cake_config,
      customization,
      checkout_details,
      status,
      status_updated_at,
      cancel_reason,
      estimated_completion_date,
      last_status_note,
      order_status_history (
        id,
        order_id,
        previous_status,
        new_status,
        note,
        changed_by,
        actor_role,
        changed_at
      )
    `)
    .eq('id', orderId)
    .single()
    )
  if (error) throw error;

  const sortedHistory = [...(data?.order_status_history ?? [])].sort(
    (a, b) => new Date(a.changed_at) - new Date(b.changed_at)
  );

  return {
    ...data,
    order_status_history: sortedHistory,
  };
}

export async function fetchAllOrdersForAdmin() {
  const { data, error } = await withTimeout(supabase
    .from('orders')
    .select(`
      id,
      user_id,
      created_at,
      reference_source,
      cake_reference_id,
      fallback_prompt,
      fallback_image_url,
      cake_config,
      customization,
      checkout_details,
      status,
      status_updated_at
    `) // Added all the missing payload columns!
    .order('created_at', { ascending: false })
  );
  if (error) throw error;
  return data ?? [];
}

export async function updateOrderStatus({ orderId, newStatus, note = '' }) {
  const { data, error } = await supabase.rpc('set_order_status', {
    p_order_id: orderId,
    p_new_status: newStatus,
    p_note: note,
  });

  if (error) throw error;
  return data;
}