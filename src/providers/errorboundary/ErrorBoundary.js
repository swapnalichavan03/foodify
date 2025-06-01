import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import Typography from '../../components/typography';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error: ', error, errorInfo);
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={{ flex: 1, backgroundColor: colors.grey[200], justifyContent: "center", alignItems: "center" }}>
                    <Typography>Something went wrong.</Typography>
                </View>
            )
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
