import React, { Fragment, useState } from 'react';
import Header from '../../../components/header';
import { RouteProp, useRoute } from '@react-navigation/native';
import { TabView, SceneMap, TabBar, type TabBarProps } from 'react-native-tab-view';
import { RootStackParamList } from '../../../utils/linking';
import { Text, TouchableOpacity, useWindowDimensions, View, } from 'react-native';
import { colors } from '../../../theme/colors';
import Typography from '../../../components/typography';
import FollowersTab from './tab/followerstab';
import FollowingTab from './tab/followingtab';

type routeProps = RouteProp<RootStackParamList, "profile/user/followers">
const UserFollowers = () => {
    const { params } = useRoute<routeProps>();
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(params.tab === "followers" ? 0 : 1);

    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
          case 'followers':
            return <FollowersTab _user={params._user} />;
          case 'following':
            return route.key === "following" && <FollowingTab _user={params._user} />;
          default:
            return null;
        }
      };

    const routes = [
        { key: 'followers', title: 'Followers' },
        { key: 'following', title: 'Following' },
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
                                {route.title === "Followers" ? params.totalfollowers : params.totalfollowing} {route.title}
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
                isBack
                title={params.name}
            />

            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                lazy={({ route }) => route.key === "followers"}
                lazyPreloadDistance={0}
            />

        </Fragment>
    );
}

export default UserFollowers;
