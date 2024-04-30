import { useLocation, Link } from '@modern-js/runtime/router';
import { Button, ButtonProps, Typography, alpha, styled } from '@mui/material';
import { ReactNode } from 'react';

export interface TabItemProps {
  label: string;
  href: string;
  icon: ReactNode;
}

export default function TabItem(props: TabItemProps) {
  const { label, href, icon } = props;
  const location = useLocation();
  return (
    <Link to={href}>
      <LinkButton isSelected={href === location.pathname} fullWidth>
        {icon}
        <Typography fontWeight="bold">{label}</Typography>
      </LinkButton>
    </Link>
  );
}

interface LinkButtonProps extends ButtonProps {
  isSelected: boolean;
}

const LinkButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'isSelected',
})<LinkButtonProps>(({ theme, isSelected }) => {
  return {
    padding: theme.spacing(1),
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& .MuiSvgIcon-root': { fontSize: '2rem' },
    color: theme.palette.text.primary,
    ...(isSelected && {
      color: theme.palette.primary.main,
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.activatedOpacity,
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.activatedOpacity,
        ),
      },
    }),
  };
});
