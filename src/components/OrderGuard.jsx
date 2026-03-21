import { Navigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";

export default function OrderGuard({
  children,
  require = {
    cakeConfig: true,
    selectedCake: true,
    customizationDraft: false,
    checkoutDraft: false,
    createdOrder: false,
  },
  redirectTo = "/",
}) {
  const {
    cakeConfig,
    selectedCake,
    customizationDraft,
    checkoutDraft,
    createdOrder,
  } = useAppFlow();

  const hasCakeConfig = !!cakeConfig && Object.values(cakeConfig).some(Boolean);
  const hasSelectedCake = !!selectedCake;
  const hasCustomization = !!customizationDraft;
  const hasCheckout = !!checkoutDraft;
  const hasOrder = !!createdOrder;

  const ok =
    (!require.cakeConfig || hasCakeConfig) &&
    (!require.selectedCake || hasSelectedCake) &&
    (!require.customizationDraft || hasCustomization) &&
    (!require.checkoutDraft || hasCheckout) &&
    (!require.createdOrder || hasOrder);

  if (!ok) return <Navigate to={redirectTo} replace />;

  return children;
}