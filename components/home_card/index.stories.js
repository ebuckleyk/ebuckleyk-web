import React from 'react';
import HomeCard from './';

const story = {
  component: HomeCard,
  title: 'Components/Home Card'
};

const Template = (args) => <HomeCard {...args} />;

export const Default = Template.bind({});
Default.args = {};

export default story;
