export default function Overlay({ show, style, ...rest }) {
  if (!show) return null;
  return (
    <div
      {...rest}
      style={{
        position: 'fixed',
        zIndex: 99,
        left: 0,
        top: 0,
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        backgroundColor: 'rgb(0,0,0)',
        backgroundColor: 'rgba(0,0,0,0.4)',
        ...style
      }}
    />
  );
}
