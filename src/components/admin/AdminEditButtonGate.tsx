import AdminEditButton from "./AdminEditButton";

export default function AdminEditButtonGate({
    href,
    label,
}: {
    href: string;
    label?: string;
}) {
    return <AdminEditButton href={href} label={label} />;
}
