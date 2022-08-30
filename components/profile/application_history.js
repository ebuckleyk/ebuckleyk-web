import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { format } from 'date-fns';

export default function ApplicationHistory({ applications = [], onClick }) {
  return (
    <TableContainer>
      <Table size="sm" variant={'striped'}>
        <Thead>
          <Tr>
            <Th>Submission Date</Th>
            <Th>Cycle</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {applications
            ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((a) => {
              return (
                <Tr
                  cursor={'pointer'}
                  onClick={() => onClick(a._id)}
                  key={a._id}
                >
                  <Td>{format(new Date(a.created_at), 'PPPpp')}</Td>
                  <Td>{a.campaign?.name}</Td>
                  <Td>{a.status?.toUpperCase()}</Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
