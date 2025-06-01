import Permissions, {
    type Permission,
    type PermissionStatus,
    requestNotifications,
} from 'react-native-permissions';
import { PERMISSIONS } from 'react-native-permissions';

export enum PermissionResult {
    GRANTED = 1,
    DENIED = 0,
    BLOCKED = -1,
}

export const requestMultiplePermissions = async (permissions: Permission[]): Promise<PermissionResult> => {
    try {
        const reqRes: Record<Permission, PermissionStatus> = await Permissions
            .requestMultiple(permissions);
        if (
            Object.keys(reqRes).every(
                (permissionName) => reqRes[permissionName as Permission] === 'granted',
            )
        ) {
            return PermissionResult.GRANTED;
        } if (
            Object.keys(reqRes).some(
                (permissionName) => reqRes[permissionName as Permission] === 'denied',
            )
        ) {
            return PermissionResult.DENIED;
        } if (
            Object.keys(reqRes).some(
                (permissionName) => reqRes[permissionName as Permission] === 'blocked',
            )
        ) {
            return PermissionResult.BLOCKED;
        }
        return PermissionResult.BLOCKED;
    } catch (err: unknown) {
        return PermissionResult.BLOCKED;
    }
};

export const checkMultiplePermissions = async (
    permissions: Permission[],
): Promise<PermissionResult> => {
    try {
        const reqRes: Record<Permission, PermissionStatus> = await
            Permissions.checkMultiple(permissions);

        if (
            Object.keys(reqRes).every(
                (permissionName) => reqRes[permissionName as Permission] === 'granted',
            )
        ) {
            return PermissionResult.GRANTED;
        } if (
            Object.keys(reqRes).some(
                (permissionName) => reqRes[permissionName as Permission] === 'denied',
            )
        ) {
            return PermissionResult.DENIED;
        } if (
            Object.keys(reqRes).some(
                (permissionName) => reqRes[permissionName as Permission] === 'blocked',
            )
        ) {
            return PermissionResult.BLOCKED;
        }
        return PermissionResult.BLOCKED;
    } catch (err: unknown) {
        return PermissionResult.BLOCKED;
    }
};