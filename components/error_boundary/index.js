import React from 'react';
import { log } from 'next-axiom';
import { v4 as uuidv4 } from 'uuid';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button
} from '@chakra-ui/react';
import LinkWrapper from '../shared/link_wrapper';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, correlationId: null };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, correlationId: uuidv4() };
  }
  componentDidCatch(error, errorInfo) {
    log.error(error.message, {
      ...errorInfo,
      correlationId: this.state.correlationId
    });
  }
  render() {
    const { correlationId } = this.state;
    // Check if the error is thrown
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100%',
            height: '80vh',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Alert
            status="error"
            variant="top-accent"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="250px"
          >
            <AlertIcon boxSize={'40px'} mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              There appears to be an unexpected error!
            </AlertTitle>
            <AlertDescription maxWidth={'sm'}>
              <p>
                <span>
                  {'Error Id: '}
                  <span style={{ fontWeight: 'bold' }}>{correlationId}</span>
                </span>
              </p>
              <p>Error Id can be used to help track issues. Thanks!</p>
            </AlertDescription>
            <Button
              colorScheme={'red'}
              mt={2}
              onClick={() => this.setState({ hasError: false })}
            >
              Reload
            </Button>
            <LinkWrapper mt={2} href="/">
              <Button variant={'link'}>Return Home</Button>
            </LinkWrapper>
          </Alert>
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
