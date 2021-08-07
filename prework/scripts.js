const BAR_STYLES = {
    alignItems: 'center',
    backgroundColor: 'black',
    color: '#fff',
    display: 'flex',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    height: 70,
    left: 0,
    padding: '10px 20px',
    position: 'fixed',
    top: 0,
    width: '100%'
}

const STYLES_CONFIG = {
    minify: true,
    mode: 'inline'
}

const MERGE_TAGS_CONFIG = {
    pattern: '%%',
    styles: objectToInlineCssStyles({ config: STYLES_CONFIG, styles: BAR_STYLES}),
    template: '<div %%tag_derp%% style=\'%%tag_styles%%\'>%%tag_content%%</div>',
    validTags: [
        'content',
        'styles'
    ]
}

function objectToInlineCssStyles({ config, styles }) {
    const stylesArray = Object.entries(styles);

    const stylesInlineString = stylesArray.map((style) => {
        const selector = style[0];
        const value = style[1];
        const upperCharMatch = selector.match(/[A-Z]/);

        if (upperCharMatch && upperCharMatch.length) {
            const lowercaseChar = upperCharMatch[0].toLowerCase();
            const kebabCasedSelector = selector.replace(/[A-Z]/, `-${lowercaseChar}`);
            return [kebabCasedSelector, value].join(':');
        }

        return [selector, value].join(':');
    });

    return stylesInlineString.join(';').replace(' ', '');
}

function parseTemplateToHtml({ config, content }) {
    let outputHtml = config.template;
    const propsWithContent = { ...config, content }
    const validTags = config.validTags.join('|');

    const logMessages = {
        errors: {
            pleaseUseValidTagsInTemplate: `Please use valid tags in your template: (${validTags})`
        }
    }

    const regex = new RegExp(
        `${config.pattern}tag_(${validTags})${config.pattern}`,
        'gi'
    );
    const matches = [...propsWithContent.template.matchAll(regex)];

    if (!matches.length) {
        throw new Error(logMessages.errors.pleaseUseValidTagsInTemplate);
    }

    matches.forEach((match) => {
        const tag = match[0];
        const tagType = match[1];
        const regex = new RegExp(`${tag}`);
        outputHtml = outputHtml.replace(regex, propsWithContent[tagType]);
    });

    return outputHtml;
}

// Remove pro dealers and non-US listings
$('.article-item-container .article-seller-name:contains("Professional dealer")').parents('.article-item-container').hide();
$('.article-item-container i.rflag').not('.rf-US').parents('.article-item-container').hide();

const outputBarHtml = parseTemplateToHtml({
    config: MERGE_TAGS_CONFIG,
    content: 'This is the content!'
});

$('body').css('padding-top', 30).prepend(outputBarHtml);