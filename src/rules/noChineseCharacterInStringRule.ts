/**
 * author: tenCats@github.com
 *
 * a lint to check chinese charecters in *.ts, *.js files
 *
 * 参考：tripleEqualsRule.ts
 */
import { isJsxText, isStringLiteral, isTemplateLiteral } from "tsutils";

import * as ts from "typescript";
import * as Lint from "../index";

const ChineseCharacterRegExp = /.*[\u4e00-\u9fa5]+.*$/m;

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-chinese-character-in-string",
        description: "No Chinese character in string! Use internationalization frameworks like i18next.",
        optionsDescription: Lint.Utils.dedent `
            No Chinese character is allowed in string.
            Putting UI texts in the code is harmful to the maintainability of a international project.
            Please use some internationalization frameworks instead!
        `,
        options: {
            type: "array",
            minLength: 0,
            maxLength: 0,
        },
        optionExamples: [true],
        type: "maintainability",
        typescriptOnly: false,
    };

    public static NO_CHINESE_CHARACTER_IN_STRING = "No Chinese character in string!";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isStringLiteral(node) ||
            isTemplateLiteral(node) ||
            isJsxText(node)) {
            if (ChineseCharacterRegExp.test(node.getFullText())) {
                ctx.addFailureAtNode(node, Rule.NO_CHINESE_CHARACTER_IN_STRING);
                return;
            }
        }
        return ts.forEachChild(node, cb);
    });
}
