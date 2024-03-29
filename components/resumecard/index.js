import {
  Box,
  Text,
  Flex,
  List,
  ListItem,
  ListIcon,
  Modal,
  HStack,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  AspectRatio,
  ModalBody
} from '@chakra-ui/react';
import { differenceInMonths, format } from 'date-fns';
import NextImage from 'next/image';
import { useEffect } from 'react';
import { FaRegCircle } from 'react-icons/fa';
import { EVENTS, GA } from '../../utils/analytics';
import GlassCard from '../glass_card';

function getDateDisplay(startDate, endDate) {
  const s = new Date(startDate);
  const e = new Date(endDate);
  const startDateFormat = format(s, 'MMMM yyyy');
  const endDateFormat = endDate ? format(e, 'MMMM yyyy') : 'Present';
  let timeInSuffix = '';

  const timeIn = differenceInMonths(
    new Date(endDate || new Date()),
    new Date(startDate)
  );

  if (timeIn >= 12) {
    const t = (timeIn / 12).toFixed(1);
    const months = Number((t % 1).toFixed(1).substring(2));
    const years = parseInt(t);
    const monthsSuffix = months ? `${months} months` : '';
    const yearSuffix = years ? `${years} year${years > 1 ? 's' : ''}` : '';
    timeInSuffix = `${yearSuffix} ${monthsSuffix}`.trim();
  } else {
    timeInSuffix = `${timeIn} months`;
  }

  return `${startDateFormat} - ${endDateFormat} (${timeInSuffix})`;
}

function Role({ role }) {
  return (
    <ListItem fontWeight={'bold'}>
      <ListIcon as={FaRegCircle} color="green.500" />
      {role.title}
    </ListItem>
  );
}

function ImageContent({ url }) {
  return <NextImage width={300} height={300} />;
}

function VideoContent({ url }) {
  return (
    <AspectRatio maxW={560} maxH={560} ratio={16 / 9}>
      <Box as="iframe" src={url} />
    </AspectRatio>
  );
}

function Thumbnail({ asset }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const url = asset.assetType === 'image' ? asset.url : asset.thumbnail;
  const isexternal_link = asset.assetType === 'external';
  useEffect(() => {
    return () => onClose();
  }, [onClose]);

  const getStyles = () => {
    return isexternal_link
      ? { as: 'a', target: '_blank', rel: 'noreferrer', href: asset.url }
      : {
          onClick: () => {
            GA.event(EVENTS.VIEW_RESUME_JOB_ASSET);
            onOpen();
          }
        };
  };
  return (
    <>
      <Box cursor={'pointer'} {...getStyles()}>
        <NextImage width={75} height={75} src={url} />
      </Box>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {asset.assetType === 'image' ? (
            <ImageContent url={url} />
          ) : (
            <VideoContent url={asset.url} />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
export default function ResumeCard({
  company,
  logo,
  multiLocation = false,
  startDate,
  endDate,
  roles = [],
  assets = []
}) {
  return (
    <GlassCard
      width={{ sm: '100%', '2xl': '80%' }}
      borderRadius={{ sm: 0, md: 20 }}
      as="article"
      padding={5}
    >
      <Flex
        flexDir={{ sm: 'column', md: 'row' }}
        justifyContent={'space-between'}
      >
        <Flex
          marginBottom={{ sm: 5, md: 0 }}
          flexDir={'column'}
          flexBasis="50%"
        >
          <Box style={{ width: 100, height: 100 }}>
            <NextImage
              width={100}
              height={100}
              src={logo}
              layout="responsive"
            />
          </Box>
          <Box>
            <Text fontWeight={'bold'}>{company}</Text>
            <Text>{getDateDisplay(startDate, endDate)}</Text>
            {!multiLocation ? <Text>{roles[0].location}</Text> : null}
          </Box>
        </Flex>
        <Flex
          data-testid="CONTENT"
          flexBasis={'50%'}
          justifyContent={assets?.length ? 'space-between' : 'center'}
          flexDir={'column'}
        >
          <List spacing={2}>
            {roles.map((r, idx) => (
              <Role key={idx} role={r} />
            ))}
          </List>
          <HStack mt={2} space={5} justifyContent="center">
            {assets?.map((a, i) => {
              return <Thumbnail key={i} asset={a} />;
            })}
          </HStack>
        </Flex>
      </Flex>
    </GlassCard>
  );
}
