import { Typography, useTheme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Track } from '../../types';

const _Track = (props: Track) => {
    const theme = useTheme();
    const { palette } = theme;
    const { album, artists } = props;
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        if (!!album?.images && album.images.length > 0) {
            setAvatar(album.images[0].url);
        }
    }, [album]);

    // main render
    return (
        <React.Fragment>
            <div className="avatar-container">
                <img key={avatar} className="avatar" src={avatar} alt={props.name} />
            </div>
            <div
                className="flex flex-col"
                style={{
                    justifyContent: 'flex-end',
                    textAlign: 'end',
                }}
            >
                <Typography
                    variant="h4"
                    component="h4"
                    style={{
                        color: palette.info.light,
                        paddingBottom: '0.5rem',
                    }}
                >
                    {props.name}
                </Typography>
                <div
                    className="flex flex-col"
                    style={{
                        fontWeight: 300,
                        fontSize: '12px',
                        color: palette.info.light,
                        justifyContent: 'flex-end',
                        textAlign: 'end',
                    }}
                >
                    <div>Type: {props?.type}</div>
                    <div className="flex flex-row" style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
                        Artists:{' '}
                        {artists?.map((a) => (
                            <div key={a.name}>{a.name}, </div>
                        ))}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export const TrackItem = React.memo(_Track);
