import React, { useEffect, useState } from 'react';
import App from './App';
import codePush from 'react-native-code-push';
import { Platform } from 'react-native';
import {
    CODEPUSH_ANDROID_PRODUCTION_DEPLOYMENT_KEY,
    CODEPUSH_IOS_PRODUCTION_DEPLOYMENT_KEY,
} from './src/utils/constants';

const codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

const AppWithCodePush = () => {
    const [progress, setProgress] = useState(false);
    const [codePushType, setCodepushType] = useState('background');

    const checkUpdateAvailable = async () => {
        const update = await codePush.checkForUpdate();
        console.log(update);
        if (update) {
            return true;
        } else return false;
    };
    const syncCodePush = (type = 'immediate') => {
        codePush.sync(
            {
                deploymentKey:
                    Platform.OS === 'ios'
                        ? CODEPUSH_IOS_PRODUCTION_DEPLOYMENT_KEY
                        : CODEPUSH_ANDROID_PRODUCTION_DEPLOYMENT_KEY,
                updateDialog: false,
                installMode: type === 'immediate' ?
                    codePush.InstallMode.IMMEDIATE :
                    codePush.InstallMode.ON_NEXT_RESUME,
            },
            (syncStatus) => {
                switch (syncStatus) {
                    //Can put log to see these stages and do some action meanwhile
                    case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                        break;
                    case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                        break;
                    case codePush.SyncStatus.INSTALLING_UPDATE:
                        break;
                    case codePush.SyncStatus.UPDATE_INSTALLED:
                        break;
                }
            }
        );
    }

    useEffect(() => {
        // This function should check if an update is available
        codePush.getUpdateMetadata().then((metadata) => {

            if (metadata.label == 'PERMIT') setCodepushType('permit');
            else setCodepushType('background');
        });

        if (codePushType == 'permit') {
            try {
                const update = checkUpdateAvailable();
                if (update) {
                    // This is to show loading state and prompt user if 
                    // they want to install updates
                    setProgress(true);
                    if (codePushType === 'permit') {
                        //show dialog box and if presses on a button 'permit'
                        const dialog = true
                        if (dialog) { syncCodePush(); }
                        else {
                            //do something when no codepush downloaded here
                        }

                    }
                }
            } catch (error) {
                console.error('CodePush update error:', error);
            } finally {
                setProgress(false);
            }
        }
        else if (codePushType === 'background') {
            syncCodePush('background');
        }
    }, []);
    return <App />;
};

export default __DEV__ ? App : codePush(codePushOptions)(AppWithCodePush);