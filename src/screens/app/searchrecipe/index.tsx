import React, { Fragment, useState } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { TabView, SceneMap, TabBar, type TabBarProps } from 'react-native-tab-view';
import Header from '../../../components/header';
import { colors } from '../../../theme/colors';
import Typography from '../../../components/typography';
import Recipes from "./tab/recipes";
import Peoples from "./tab/peoples";

const SearchRecipe = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'recipes':
        return <Recipes />;
      case 'peoples':
        return <Peoples />;
      default:
        return null;
    }
  };

  const routes = [
    { key: 'recipes', title: 'Recipes' },
    { key: 'peoples', title: 'Peoples' },
  ];

  const renderTabBar = (props: TabBarProps<{ key: string; title: string }>) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary.main }}
      style={{ backgroundColor: colors.grey[200], borderBottomColor: colors.grey[300], borderStyle: "solid", borderBottomWidth: 1 }}
      renderTabBarItem={({ route }) => {
        const focused = props.navigationState.routes[props.navigationState.index].key === route.key;

        return (
          <View style={{ alignItems: 'center', padding: 10, width: layout.width / 2 }}>
            <TouchableOpacity
              onPress={() => {
                // const routeIndex = props.navigationState.routes.findIndex(
                //     (r) => r.key === route.key
                // );
                props.jumpTo(route.key); // Navigate to the tab on press
              }}
              activeOpacity={0.7}
            >
              <Typography variant="SmallTextRegular" color={focused ? colors.primary.main : colors.grey[900]}>
                {route.title}
              </Typography>
            </TouchableOpacity>
          </View>
        )
      }}
    />
  );

  return (
    <Fragment>
      <Header
        title={"Search Recipe"}
        isBack
        rightAction={() => {
          return (
            <Fragment>
            </Fragment>
          )
        }}
        leftAction={() => {
          return (
            <Fragment>
            </Fragment>
          )
        }}
      />

      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy={({ route }) => route.key === "peoples"}
      />
    </Fragment>
  )
}

export default SearchRecipe
