import { Button, Modal, TextField, useTheme } from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { logger } from '../../common-util';
import { actions, AppCtx } from '../../context';

const _OptionsModal = (_props: any) => {
    const theme = useTheme();
    const palette = useMemo(() => theme.palette, [theme]);
    const { state, dispatch } = useContext(AppCtx);

    const handleToggleModal = useCallback(() => {
        dispatch({ type: actions.TOGGLE_OPTIONS_MODAL });
    }, [dispatch]);

    useEffect(() => {
        logger('mounting options modal');
    }, []);

    //#region renders

    const renderFormItems = useCallback(() => {
        return FORM_INPUTS.map((input) => {
            return (
                <TextField
                    key={input.id}
                    name={input.name}
                    variant="filled"
                    type={input.type}
                    defaultValue={input.defaultValue}
                    label={input.label}
                />
            );
        });
    }, []);

    const renderForm = useCallback(() => {
        return (
            <form className="flex flex-1 flex-col" style={{ border: '3px red solid' }}>
                {renderFormItems()}
            </form>
        );
    }, [renderFormItems]);
    //#endregion

    // main render
    return (
        <React.Fragment>
            <Modal
                className="flex flex-col flex-1 flex-justify-center"
                open={state.openOptionsModal}
                onClose={handleToggleModal}
            >
                <div
                    className="flex flex-col flex-1 flex-justify-center"
                    style={{
                        overflow: 'hidden',
                        maxWidth: '80%',
                        justifyContent: 'center',
                        border: '3px red solid',
                    }}
                >
                    <div className="flex" style={{ backgroundColor: palette.success.main, color: 'white' }}>
                        <h2>Playlist Generator Options</h2>
                    </div>
                    <div
                        className="flex flex-1 flex-col"
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '0px 0px 10px 10px',
                            padding: '1rem 3rem',
                            maxHeight: '40vh',
                        }}
                    >
                        <div className="flex flex-row flex-1">
                            {renderForm()}
                            <div className="flex">
                                <h4>Spotify music analysis options</h4>
                                <Button>a button here</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
};

const OptionsModal = React.memo(_OptionsModal);

export default OptionsModal;

const FORM_INPUTS = [
    {
        id: 'trackLimit',
        name: 'trackLimit',
        label: 'Artist Track Limit',
        type: 'number',
        defaultValue: 3,
    },
    {
        id: 'randomizeTracks',
        name: 'randomizeTracks',
        label: 'Randomize Tracks',
        type: 'checkbox',
        defaultValue: false,
    },
    {
        id: 'trackLimit',
        name: 'trackLimit',
        label: 'Artist Track Limit',
        type: 'number',
        defaultValue: 3,
    },
];
