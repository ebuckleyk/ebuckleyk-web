import {
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider
} from '@chakra-ui/react';
import useSWR from 'swr';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTwitter, FaBlog } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import BlogCard from '../../components/blogcard';
import { STAGGER_LOAD_ITEMS_ANIMATION } from '../../utils/animation';
import FilterOptionsContainer from '../../components/shared/filter_options_container';
import useDebounce from '../../utils/hooks/useDebounce';

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const DEFAULT_SOURCE_OPTION = 'all';

function BlogSourceOptions({ activeOpt, onClick }) {
  return (
    <ButtonGroup size="md" isAttached variant={'ghost'}>
      <Button isActive={activeOpt === 'all'} onClick={() => onClick('all')}>
        All
      </Button>
      <IconButton
        colorScheme={'twitter'}
        icon={<FaTwitter />}
        isActive={activeOpt === 'twitter'}
        onClick={() => onClick('twitter')}
      />
      <IconButton
        colorScheme={'red'}
        icon={<FaBlog />}
        isActive={activeOpt === 'blog'}
        onClick={() => onClick('blog')}
      />
    </ButtonGroup>
  );
}

function SearchOption({ value, onChange }) {
  return (
    <InputGroup>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant={'flushed'}
        placeholder="Search..."
      />
      <InputRightElement
        _hover={{ cursor: 'pointer' }}
        onClick={() => onChange('')}
        display={value ? 'flex' : 'none'}
      >
        <CloseIcon w={3} h={3} color="blackAlpha.400" />
      </InputRightElement>
    </InputGroup>
  );
}
export default function Blogs() {
  const [sourceOpt, setSourceOpt] = useState(DEFAULT_SOURCE_OPTION);
  const [searchValue, setSearchValue] = useState('');
  const { data } = useSWR('/api/blogs', fetcher);
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const [filteredBySource, setFilteredBySource] = useState(data);
  const [filteredByText, setFilteredByText] = useState(data);

  // filter on blog source
  useEffect(() => {
    if (!data) return;
    const filtered = data.filter((x) =>
      new RegExp(sourceOpt.replace(DEFAULT_SOURCE_OPTION, '')).test(x.source)
    );
    setFilteredBySource(filtered);
  }, [data, sourceOpt]);

  // filter on blog content
  useEffect(() => {
    if (!data) return;
    const filtered = data.filter((x) => {
      if (x.source === 'blog') {
        // TODO: Need to do some testing here to parse JSON. Return true for now
        return true;
      }
      return new RegExp(debouncedSearchValue, 'i').test(x.content);
    });
    setFilteredByText(filtered);
  }, [data, debouncedSearchValue]);

  const blogs = useMemo(
    () =>
      data?.filter(
        (x) => filteredBySource?.includes(x) && filteredByText?.includes(x)
      ),
    [data, filteredBySource, filteredByText]
  );

  return (
    <>
      <FilterOptionsContainer>
        <HStack divider={<StackDivider />}>
          <BlogSourceOptions activeOpt={sourceOpt} onClick={setSourceOpt} />
          <SearchOption value={searchValue} onChange={setSearchValue} />
        </HStack>
      </FilterOptionsContainer>
      <AnimatePresence>
        <Grid
          as={motion.div}
          {...STAGGER_LOAD_ITEMS_ANIMATION.containerProps}
          variants={STAGGER_LOAD_ITEMS_ANIMATION.containerVariant}
          gap={3}
          mt={5}
          p={{ sm: 0, md: 5 }}
          width={{ sm: '100%' }}
          templateColumns={{
            sm: 'repeat(auto-fill, minmax(100%, 1fr))',
            md: 'repeat(auto-fill, minmax(33%, 1fr))'
          }}
        >
          {blogs?.map((d) => {
            return (
              <GridItem
                as={motion.div}
                variants={STAGGER_LOAD_ITEMS_ANIMATION.itemVariant}
                key={d.id}
              >
                <BlogCard
                  key={d.id}
                  source={d.source}
                  img={d.imageUrl}
                  title={d.title}
                  content={d.content}
                  date={d.displayDate}
                  navigateTo={d.link}
                />
              </GridItem>
            );
          })}
        </Grid>
      </AnimatePresence>
    </>
  );
}

Blogs.displayName = 'Blogs';
