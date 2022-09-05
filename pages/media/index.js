import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  ButtonGroup,
  Button,
  Select,
  HStack,
  StackDivider
} from '@chakra-ui/react';
import GlassCard from '../../components/glass_card';
import web_public_api from '../../utils/api';

const MediaGallery = dynamic(() => import('../../components/media_gallery'), {
  ssr: true
});

const DEFAULT_IMAGE_VIDEO_OPTION = 'both';
const DEFAULT_CATEGORY_OPTION = '';
function ImageVideoOptions({ activeOpt, onClick }) {
  return (
    <ButtonGroup size="md" isAttached variant={'ghost'}>
      <Button isActive={activeOpt === 'both'} onClick={() => onClick('both')}>
        All
      </Button>
      <Button isActive={activeOpt === 'image'} onClick={() => onClick('image')}>
        Images
      </Button>
      <Button isActive={activeOpt === 'video'} onClick={() => onClick('video')}>
        Videos
      </Button>
    </ButtonGroup>
  );
}

function CategoryOptions({ activeOpt, onChange }) {
  return (
    <Select
      variant={'flushed'}
      placeholder="Categories..."
      onChange={(a) => onChange(a.target.value)}
      value={activeOpt}
    >
      <option value="awardee">Awardees</option>
      <option value="social">Social</option>
    </Select>
  );
}

export default function Media({ media }) {
  const [mediaItems, _] = useState(media ?? []);
  const [filteredByMediaType, setFilteredByMediaType] = useState(mediaItems);
  const [filteredByCategory, setFilteredByCategory] = useState(mediaItems);
  const [imageVideoOpt, setImageVideoOpt] = useState(
    DEFAULT_IMAGE_VIDEO_OPTION
  );
  const [categoryOpt, setCategoryOpt] = useState(DEFAULT_CATEGORY_OPTION);

  // apply video/image filter
  useEffect(() => {
    if (!mediaItems.length) return;
    const filtered = mediaItems.filter((x) =>
      x.mediaType.includes(
        imageVideoOpt.replace(DEFAULT_IMAGE_VIDEO_OPTION, '')
      )
    );
    setFilteredByMediaType(filtered);
  }, [imageVideoOpt, mediaItems]);

  // apply category filter
  useEffect(() => {
    if (!mediaItems.length) return;
    const filtered = mediaItems.filter((x) => x.category.includes(categoryOpt));
    setFilteredByCategory(filtered);
  }, [categoryOpt, mediaItems]);

  const items = useMemo(
    () =>
      mediaItems.filter(
        (x) => filteredByMediaType.includes(x) && filteredByCategory.includes(x)
      ),
    [filteredByCategory, filteredByMediaType, mediaItems]
  );

  return (
    <>
      <GlassCard
        w={{ sm: '100%', md: '50%' }}
        borderRadius={'0px 0px 5px 5px'}
        style={{
          marginTop: '-18px',
          marginBottom: '18px',
          position: 'fixed',
          zIndex: 1
        }}
      >
        <HStack divider={<StackDivider />}>
          <ImageVideoOptions
            activeOpt={imageVideoOpt}
            onClick={setImageVideoOpt}
          />
          <CategoryOptions activeOpt={categoryOpt} onChange={setCategoryOpt} />
        </HStack>
      </GlassCard>
      <Box w={{ sm: '100%', lg: '75%' }} mt={7} position="relative">
        <MediaGallery media={items} galleryName="media-highlights" />
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  const media = await web_public_api('/media-public');
  return {
    props: {
      media
    }
  };
}

Media.displayName = 'Media';
