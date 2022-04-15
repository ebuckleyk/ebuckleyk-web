import React from 'react';
import HomeCard from './';

export default {
  component: HomeCard,
  title: 'Components/Home Card'
};

const Template = (args) => <HomeCard {...args} />;

export const Default = Template.bind({});
Default.args = {};
