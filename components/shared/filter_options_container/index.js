import GlassCard from '../../glass_card';

export default function FilterOptionsContainer({ children }) {
  if (!children) return null;
  return (
    <GlassCard
      w={{ sm: '100%', md: '50%' }}
      borderRadius={'0px 0px 5px 5px'}
      boxShadow="md"
      style={{
        marginTop: '-18px',
        position: 'fixed',
        zIndex: 1
      }}
    >
      {children}
    </GlassCard>
  );
}
