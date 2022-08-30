export const STAGGER_LOAD_ITEMS_ANIMATION = {
  itemVariant: {
    closed: {
      opacity: 0
    },
    open: { opacity: 1 }
  },
  containerVariant: {
    closed: {
      transition: {
        staggerChildren: 0.2,
        staggerDirection: -1
      }
    },
    open: {
      transition: {
        staggerChildren: 0.2,
        staggerDirection: 1
      }
    }
  },
  containerProps: {
    initial: 'closed',
    animate: 'open',
    exit: 'closed'
  }
};
