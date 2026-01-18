import { useMemo, useState } from "react";
import type {
  ListButtonLeading,
  ListButtonProps,
  ListButtonTrailing,
  ListButtonVariant,
  SvgIconComponent,
  ListButtonIconVariant,
} from "./types";
import { getListButtonClassNames } from "./styles";
import PlusIcon from "../../../assets/icons/plus.svg?react";
import SwitchIcon from "../../../assets/icons/switch.svg?react";
import CheckIcon from "../../../assets/icons/check.svg?react";

const cn = (...args: Array<string | undefined | false>) => args.filter(Boolean).join(" ");

const SvgIcon = (props: { Icon: SvgIconComponent; className?: string }) => {
  const { Icon, className } = props;
  return (
    <Icon
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", "[&_*]:fill-current [&_*]:stroke-current", className)}
    />
  );
};

const DEFAULT_ICONS: Record<ListButtonIconVariant, SvgIconComponent> = {
  plus: PlusIcon,
  switch: SwitchIcon,
  check: CheckIcon,
};

const resolveIcon = (
  key: ListButtonIconVariant,
  overrides?: Partial<Record<ListButtonIconVariant, SvgIconComponent | null>>
): SvgIconComponent | null => {
  if (overrides && Object.prototype.hasOwnProperty.call(overrides, key)) {
    const v = overrides[key];
    return v ?? null;
  }
  return DEFAULT_ICONS[key];
};

const renderLeading = (
  leading: ListButtonLeading | undefined,
  styles: ReturnType<typeof getListButtonClassNames>,
  iconOverrides: ListButtonProps["icons"],
  leadingClassName?: string,
  isEmptyPlaceholder?: boolean
) => {

  const iconBox = styles.iconBox.replace("bg-current", "").trim();

  if (isEmptyPlaceholder) {
    return <span className={cn(iconBox, leadingClassName)} aria-hidden />;
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
        {leading.icons.map((k, idx) => {
          const IconComp = resolveIcon(k, iconOverrides);
          if (!IconComp) return null;
          return <SvgIcon key={`${k}-${idx}`} Icon={IconComp} className={iconBox} />;
        })}
      </span>
    );
  }

  const IconComp = resolveIcon(leading.icon, iconOverrides);
  if (!IconComp) return null;
  return <SvgIcon Icon={IconComp} className={cn(iconBox, leadingClassName)} />;
};

const renderTrailing = (
  trailing: ListButtonTrailing | undefined,
  styles: ReturnType<typeof getListButtonClassNames>,
  iconOverrides: ListButtonProps["icons"],
  trailingClassName?: string,
  shouldHide?: boolean,
  variant?: ListButtonVariant,
  disabled?: boolean
) => {
  if (!trailing || trailing.type === "none") return null;

  const iconBox = styles.iconBox.replace("bg-current", "").trim();
  const IconComp = resolveIcon(trailing.icon, iconOverrides);
  if (!IconComp) return null;

  const switchIconColor =
    variant === "dynamicWhiteMImgTextIcon" && trailing.icon === "switch" && !disabled
      ? "text-grayscale-black"
      : undefined;

  return (
    <span className={styles.right}>
      <SvgIcon
        Icon={IconComp}
        className={cn(iconBox, switchIconColor, shouldHide && "opacity-0", trailingClassName)}
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
  icons,
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

  const isEmptyPlaceholder = !isDynamicWhiteSIconsText && leading.type === "none";
  const iconOverrides = useMemo(() => icons, [icons]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (isDynamicWhiteSIconsText || isDynamicWhiteMImgTextIcon) {
      setIsClicked((prev) => !prev);
    }

    onClick?.(e);
  };

  const iconBox = styles.iconBox.replace("bg-current", "").trim();
  const CheckIcon = resolveIcon("check", iconOverrides);
  const PlusIcon = resolveIcon("plus", iconOverrides);

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
          <span className={cn("flex items-center gap-[0.5rem]", leadingClassName)}>
            {CheckIcon ? (
              <SvgIcon Icon={CheckIcon} className={cn(iconBox, !isClicked && "opacity-0")} />
            ) : null}
            {PlusIcon ? <SvgIcon Icon={PlusIcon} className={iconBox} /> : null}
          </span>
        ) : (
          renderLeading(leading, styles, iconOverrides, leadingClassName, isEmptyPlaceholder)
        )}

        <span className={cn(styles.label, labelClassName)}>{label}</span>
      </span>

      {renderTrailing(trailing, styles, iconOverrides, trailingClassName, shouldHideTrailing, variant, disabled)}
    </button>
  );
};

type WrapperProps = Omit<ListButtonProps, "variant">;

const defaultsByVariant: Record<ListButtonVariant, Pick<ListButtonProps, "leading" | "trailing">> = {
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

    return <ListButton {...p} variant={variant} leading={leading} trailing={trailing} />;
  };

  return Comp;
};

export const StaticWhiteMIconTextButton = withVariant("staticWhiteMIconText");
export const DynamicWhiteMImgTextIconButton = withVariant("dynamicWhiteMImgTextIcon");
export const DynamicWhiteMIconTextButton = withVariant("dynamicWhiteMIconText");
export const DynamicWhiteMSmoothIconTextButton = withVariant("dynamicWhiteMSmoothIconText");
export const DynamicWhiteSIconsTextButton = withVariant("dynamicWhiteSIconsText");
export const DynamicWhiteSIconTextButton = withVariant("dynamicWhiteSIconText");
