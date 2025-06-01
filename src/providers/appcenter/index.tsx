import React, { ReactNode, Fragment, useState, useEffect } from 'react';
import codePush, { RemotePackage, DownloadProgress } from 'react-native-code-push';
import Typography from '../../components/typography';
import { ActivityIndicator, Button, Modal, StyleSheet, Text, View } from 'react-native';

const AppCenter = ({ children }: { children?: ReactNode }) => {
    const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
    const [updateInfo, setUpdateInfo] = useState<RemotePackage | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    // Check for updates on app load
    useEffect(() => {
        // checkForUpdates();
    }, []);

    // Function to check for updates
    const checkForUpdates = async (): Promise<void> => {
        try {
            const update = await codePush.checkForUpdate();
            if (update) {
                setUpdateInfo(update); // Store update details
                setUpdateAvailable(true); // Show custom modal
            }
        } catch (error) {
            console.log("Error checking for update:", error);
        }
    };

    // Function to handle update download and installation
    // const handleUpdate = (): void => {
    //     setIsDownloading(true);
    //     codePush.sync(
    //         {
    //             installMode: codePush.InstallMode.IMMEDIATE, // Install immediately after download
    //             updateDialog: false, // Disable the default dialog
    //         },
    //         (status) => {
    //             // Optional: Log different statuses
    //             console.log("CodePush Status:", status);
    //         },
    //         (progress: DownloadProgress) => {
    //             // Update download progress
    //             const percentage = Math.round(
    //                 (progress.receivedBytes / progress.totalBytes) * 100
    //             );
    //             setProgress(percentage);
    //         }
    //     );
    // };
    const handleUpdate = (): void => {
        setIsDownloading(true);
        codePush.sync(
          {
            installMode: codePush.InstallMode.IMMEDIATE, // Install immediately after download
            updateDialog: false, // Disable the default dialog
          },
          (status) => {
            console.log("CodePush Status:", status);
            if (status === codePush.SyncStatus.UPDATE_INSTALLED) {
              // Update is installed, close the modal
              setIsDownloading(false);
              setUpdateAvailable(false);
            } else if (status === codePush.SyncStatus.UP_TO_DATE) {
              // No update available, close the modal
              setIsDownloading(false);
              setUpdateAvailable(false);
            }
          },
          (progress: DownloadProgress) => {
            // Update download progress
            const percentage = Math.round(
              (progress.receivedBytes / progress.totalBytes) * 100
            );
            setProgress(percentage);
      
            // Optional: Automatically close modal when progress reaches 100%
            if (percentage === 100) {
              setIsDownloading(false);
              setUpdateAvailable(false);
            }
          }
        );
      };

    return (
        <Fragment>
            {children}
            <Modal visible={updateAvailable} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Available</Text>
                        <Text style={styles.modalDescription}>
                            {updateInfo?.description || "A new update is available. Install it now to enjoy the latest features!"}
                        </Text>

                        {/* Download Progress */}
                        {isDownloading ? (
                            <View style={styles.progressContainer}>
                                <ActivityIndicator size="large" color="#0000ff" />
                                <Text style={styles.progressText}>{progress}%</Text>
                            </View>
                        ) : (
                            <View style={styles.buttonContainer}>
                                <Button title="Update Now" onPress={handleUpdate} />
                                <Button title="Later" onPress={() => setUpdateAvailable(false)} color="gray" />
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

        </Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    progressContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    progressText: {
        fontSize: 18,
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
    },
});

// export default AppCenter;
export default codePush({
    checkFrequency: codePush.CheckFrequency.MANUAL,
    // checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    // updateDialog: {
    //     title: "Update Available",
    //     optionalUpdateMessage: "A new update is available. Would you like to install it?",
    //     optionalInstallButtonLabel: "Install",
    //     optionalIgnoreButtonLabel: "Ignore",
    //     mandatoryUpdateMessage: "A critical update is available and must be installed.",
    //     mandatoryContinueButtonLabel: "Continue",
    // },
    // installMode: codePush.InstallMode.IMMEDIATE, // Change to ON_NEXT_RESTART if you want to apply updates later
})(AppCenter)
