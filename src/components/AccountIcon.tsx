import { IdentityIcon, Avatar } from "@/components";

function AccountIcon({
  active,
  onClick,
  size = 36,
  value,
  withBorder,
}: {
  active?: boolean;
  withBorder?: boolean;
  size?: number;
  value?: string | null;
  onClick?: () => void;
}) {
  if (withBorder) {
    if (active) {
      return (
        <div onClick={onClick}>
          <div>
            <Avatar
              style={{
                width: size,
                height: size,
                backgroundColor: "#F0F0F5",
                border: "1px solid #E0E0E4",
              }}
            >
              <IdentityIcon diameter={size - 6} value={value} />
            </Avatar>
          </div>
        </div>
      );
    } else {
      return (
        <Avatar
          alt={value || ""}
          sx={{
            width: size,
            height: size,
            backgroundColor: "#F0F0F5",
            border: "1px solid #E0E0E4",
          }}
        >
          <IdentityIcon diameter={size - 6} value={value} />
        </Avatar>
      );
    }
  } else {
    return (
      <Avatar
        alt={value || ""}
        onClick={onClick}
        sx={{ width: size, height: size }}
      >
        <IdentityIcon diameter={size} value={value} />
      </Avatar>
    );
  }
}

export default AccountIcon;
