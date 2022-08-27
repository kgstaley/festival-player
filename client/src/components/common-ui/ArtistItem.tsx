import { Typography, useTheme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Artist } from '../../types';

const _Artist = (props: Artist) => {
    const theme = useTheme();
    const { palette } = theme;
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        if (!!props.images && props.images.length > 0) {
            setAvatar(props.images[0].url);
        }
    }, [props]);

    // main render
    return (
        <React.Fragment>
            <div className="avatar-container">
                <img key={avatar} className="avatar" src={avatar} alt={props.name} />
            </div>
            <div className="flex flex-col" style={{ justifyContent: 'flex-end', textAlign: 'end' }}>
                <Typography variant="h4" component="h4" style={{ color: palette.info.light, paddingBottom: '0.5rem' }}>
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
                    <div>Followers: {props.followers?.total?.toString() || ''}</div>
                    <div>Genres: {props.genres?.map((g) => g).join(', ')}</div>
                </div>
            </div>
        </React.Fragment>
    );
};

export const ArtistItem = React.memo(_Artist);
