import { useState } from "react";
import type { ListButtonLeading, ListButtonProps, ListButtonTrailing, ListButtonVariant } from "./types";
import { ICON_SRC } from "./icons";
import { getListButtonClassNames } from "./styles";

const cn = (...args: Array<string | undefined | false>) => args.filter(Boolean).join(" ");

const MaskIcon = (props: { src: string; className: string }) => {
  const { src, className } = props;

  return (
    <span
      aria-hidden
      className={cn("shrink-0 bg-current", className)}
      style={{
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
};

const renderLeading = (
  leading: ListButtonLeading | undefined,
  styles: ReturnType<typeof getListButtonClassNames>,
  leadingClassName?: string,
  isEmptyPlaceholder?: boolean
) => {
  if (isEmptyPlaceholder) {
    // 빈 공간 유지
    return (
      <span
        className={cn(styles.iconBox.replace("bg-current", "bg-transparent"), leadingClassName)}
        aria-hidden
      />
    );
  }

  if (!leading || leading.type === "none") return null;

  if (leading.type === "avatar") {
    if (leading.src) {
      return (
        <img
          src={leading.src}
          alt={leading.alt ?? "avatar"}
          className={cn(styles.avatar, "object-cover", leading.className, leadingClassName)}
        />
      );
    }
    return (
      <span className={cn(styles.avatar, leading.className, leadingClassName)}>
        {leading.fallbackText ?? "U"}
      </span>
    );
  }

  if (leading.type === "icons") {
    return (
      <span className={cn("flex items-center gap-[10px]", leadingClassName)}>
        {leading.icons.map((k, idx) => (
          <MaskIcon key={`${k}-${idx}`} src={ICON_SRC[k]} className={styles.iconBox} />
        ))}
      </span>
    );
  }

  return (
    <MaskIcon
      src={ICON_SRC[leading.icon]}
      className={cn(styles.iconBox, leadingClassName)}
    />
  );
};

const renderTrailing = (
  trailing: ListButtonTrailing | undefined,
  styles: ReturnType<typeof getListButtonClassNames>,
  trailingClassName?: string,
  shouldHide?: boolean,
  variant?: ListButtonVariant,
  disabled?: boolean
) => {
  if (!trailing || trailing.type === "none") return null;

  // 아이콘 색 같이 안 바뀌게 설정
  const switchIconColor =
    variant === "dynamicWhiteMImgTextIcon" && trailing.icon === "switch" && !disabled
      ? "text-grayscale-black"
      : undefined;

  return (
    <span className={styles.right}>
      <MaskIcon
        src={ICON_SRC[trailing.icon]}
        className={cn(
          styles.iconBox,
          switchIconColor,
          shouldHide && "opacity-0",
          trailingClassName
        )}
      />
    </span>
  );
};

export const ListButton = ({
  variant,
  label,
  leading = { type: "none" },
  trailing = { type: "none" },
  selected = false,
  disabled,
  type = "button",
  className,
  labelClassName,
  leadingClassName,
  trailingClassName,
  onClick,
  ...rest
}: ListButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const isDynamicWhiteSIconsText = variant === "dynamicWhiteSIconsText";
  const isDynamicWhiteMImgTextIcon = variant === "dynamicWhiteMImgTextIcon";
  

  const shouldHideTrailing = isDynamicWhiteMImgTextIcon && isClicked;
  const hasTrailing = !!trailing && trailing.type !== "none";

  const styles = getListButtonClassNames({
    variant,
    selected,
    disabled,
    hasTrailing,
    className,
  });

  const isEmptyPlaceholder =
    !isDynamicWhiteSIconsText && leading.type === "none";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (isDynamicWhiteSIconsText || isDynamicWhiteMImgTextIcon) {
      setIsClicked((prev) => !prev);
    }
    
    onClick?.(e);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      className={styles.button}
      onClick={handleClick}
      {...rest}
    >
      <span className={styles.left}>
        {isDynamicWhiteSIconsText ? (
          // 클릭 시 체크 보이게
          <span className={cn("flex items-center gap-[0.5rem]", leadingClassName)}>
            <MaskIcon
              src={ICON_SRC.check}
              className={cn(styles.iconBox, !isClicked && "opacity-0")}
            />
            <MaskIcon src={ICON_SRC.plus} className={styles.iconBox} />
          </span>
        ) : (
          renderLeading(leading, styles, leadingClassName, isEmptyPlaceholder)
        )}
        <span className={cn(styles.label, labelClassName)}>{label}</span>
      </span>

      {renderTrailing(trailing, styles, trailingClassName, shouldHideTrailing, variant, disabled)}
    </button>
  );
};

type WrapperProps = Omit<ListButtonProps, "variant">;

const defaultsByVariant: Record<
  ListButtonVariant,
  Pick<ListButtonProps, "leading" | "trailing">
> = {
  staticWhiteMIconText: {
    leading: { type: "icon", icon: "plus" },
    trailing: { type: "none" },
  },

  dynamicWhiteMImgTextIcon: {
    leading: { type: "avatar", fallbackText: "U" },
    trailing: { type: "icon", icon: "switch" },
  },

  dynamicWhiteMIconText: {
    leading: { type: "icon", icon: "plus" },
    trailing: { type: "none" },
  },

  dynamicWhiteMSmoothIconText: {
    leading: { type: "icon", icon: "plus" },
    trailing: { type: "none" },
  },

  dynamicWhiteSIconsText: {
    leading: { type: "none" },
    trailing: { type: "none" },
  },

  dynamicWhiteSIconText: {
    leading: { type: "icon", icon: "plus" },
    trailing: { type: "none" },
  },
};

const withVariant = (variant: ListButtonVariant) => {
  const d = defaultsByVariant[variant];

  const Comp = (p: WrapperProps) => {
    const trailing = p.trailing ?? d.trailing;
    const leading = p.leading ?? d.leading;

    return (
      <ListButton
        {...p}
        variant={variant}
        leading={leading}
        trailing={trailing}
      />
    );
  };

  return Comp;
};

export const StaticWhiteMIconTextButton = withVariant("staticWhiteMIconText");
export const DynamicWhiteMImgTextIconButton = withVariant("dynamicWhiteMImgTextIcon");
export const DynamicWhiteMIconTextButton = withVariant("dynamicWhiteMIconText");
export const DynamicWhiteMSmoothIconTextButton = withVariant("dynamicWhiteMSmoothIconText");
export const DynamicWhiteSIconsTextButton = withVariant("dynamicWhiteSIconsText");
export const DynamicWhiteSIconTextButton = withVariant("dynamicWhiteSIconText");

