import { PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackMenu from '../components/BackMenu'
import { ScrollView } from 'react-native-gesture-handler'
import ProgressImage from '../components/ProgressImage';
import { CONFIG, WIDTH } from '../constants';
import { CertificateType } from '../constants/types';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Button, useTheme } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import { ToastMessage } from '../constants/Functions';
import * as RNFS from "react-native-fs"
// import Share from 'react-native-share';

export default function Certificate(props: any) {
    const certificate: CertificateType = props.route.params.certificate;
    const course_title: string = props.route.params.course_title;

    const theme = useTheme();
    const CERT_URL = CONFIG.API.CERTIFICATE_HASH + certificate.hash;

    const [downloading, setDownloading] = useState(false);
    const [certificateurl, setCertificateurl] = useState("");
    const [startShare, setStartShare] = useState(false);

    const copyHashID = () => {
        Clipboard.setString(certificate.hash);
        ToastMessage("success", "Copied Successfully!!!");
    }

    const getFilename = (url: string) => {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        return filename;
    }

    const downloadFinalImage = () => {
        try {
            const storeImagePath = RNFS.DownloadDirectoryPath + "/" + getFilename(certificate.image);
            setDownloading(true);
            RNFS.downloadFile({
                fromUrl: certificate.image,
                toFile: storeImagePath,
                background: true,
                discretionary: true
            }).promise.then(() => {
                setCertificateurl(storeImagePath);
                ToastMessage("success", "Certificate Downloaded Successfully!!!");
            }).catch((error) => {
                console.log(error);
                ToastMessage("error", "Unable to Downloaded Certificate!!!");
            }).finally(() => {
                setDownloading(false);
            })
        } catch (error: any) {
            ToastMessage("error", error?.message);
            setDownloading(false);
        }
    }

    const downloadImage = async () => {
        try {
            if (Platform.OS === 'ios') {
                downloadFinalImage();
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                        {
                            title: 'Storage Permission Required',
                            message: 'App needs access to your storage to download Photos',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        }
                    );

                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        downloadFinalImage();
                    } else {
                        ToastMessage("error", 'Storage Permission Not Granted', "Error");
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        } catch (error: any) {
            ToastMessage("error", error?.message, "Error");
        }
    }

    const shareImage = async () => {
        const shareOptions = {
            title: 'Certificate by Digital Gurkha - ' + course_title,
            url: 'file://' + certificateurl,
            failOnCancel: false,
        };

        // try {
        //     await Share.open(shareOptions);
        // } catch (error) {
            
        // }
    }

    useEffect(() => {
        if (certificateurl.length > 0) {
            shareImage();
        }
    }, [certificateurl])

    return (
        <BackMenu title="Certificate">
            <ScrollView style={{
                padding: 10
            }} >
                <ProgressImage
                    source={{
                        uri: certificate?.image
                    }}
                    style={{
                        width: WIDTH - 20,
                        height: (2640 / 3417) * (WIDTH - 20)
                    }}
                    resizeMode="contain"
                />

                <View style={{
                    marginVertical: 20,
                    marginHorizontal: 20
                }}>
                    <View style={[styles.cert_info_container, {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }]}>
                        <View>
                            <Text>Credential ID</Text>
                            <Text style={[styles.cert_label, {
                                color: theme.colors.onBackground
                            }]}>#{certificate.hash}</Text>
                        </View>

                        <TouchableOpacity style={[styles.copybtn, {
                            backgroundColor: theme.dark ? theme.colors.inversePrimary : "rgb(179, 231, 177)"
                        }]} onPress={copyHashID}>
                            <Ionicons color={theme.colors.primary} name="copy-outline" size={20} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cert_info_container}>
                        <Text>Issued By</Text>
                        <Text style={[styles.cert_label, {
                            color: theme.colors.onBackground
                        }]}>{certificate.issued_by}</Text>
                    </View>

                    <View style={styles.cert_info_container}>
                        <Text>Issued Date</Text>
                        <Text style={[styles.cert_label, {
                            color: theme.colors.onBackground
                        }]}>{certificate.issue_date}</Text>
                    </View>
                </View>

                <Button
                    mode="outlined"
                    style={{
                        borderColor: theme.colors.primary,
                        marginBottom: 10
                    }}
                    onPress={downloadImage}
                    disabled={downloading}
                    loading={downloading}
                    icon="cloud-download-outline"
                >
                    {downloading ? "Downloading . . ." : "Download Certificate"}
                </Button>

                <Button
                    mode="outlined"
                    style={{
                        borderColor: theme.colors.primary,
                        marginTop: 10
                    }}
                    onPress={shareImage}
                    disabled={downloading}
                    loading={downloading}
                    icon="share-variant"
                    aria-disabled={certificateurl.length <= 0}
                >
                    {downloading ? "Downloading . . ." : "Share Certificate"}
                </Button>
            </ScrollView>
        </BackMenu>
    )
}

const styles = StyleSheet.create({
    cert_info_container: {
        marginBottom: 15
    },
    cert_label: {
        fontWeight: "bold",
        color: "#000"
    },
    copybtn: {
        backgroundColor: "rgb(179, 231, 177)",
        padding: 5,
        borderRadius: 100,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    }
})