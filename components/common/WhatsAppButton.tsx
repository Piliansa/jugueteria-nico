import LinkButton from "@/components/common/LinkButton";
import { siteConfig } from "@/config/site";

type WhatsAppButtonProps = {
  productName: string;
};

export default function WhatsAppButton({ productName }: WhatsAppButtonProps) {
  const message = `Hola! Quisiera consultar por el producto ${productName}.`;

  const encodedMessage = encodeURIComponent(message);

  const url = `https://wa.me/${siteConfig.whatsapp}?text=${encodedMessage}`;

  return (
    <LinkButton href={url} target="_blank" rel="noopener noreferrer" fullWidth>
      Consultar por WhatsApp
    </LinkButton>
  );
}
